package com.tazeenmobile

import android.graphics.Color
import androidx.fragment.app.FragmentActivity
import androidx.activity.result.contract.ActivityResultContracts
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.truecaller.android.sdk.oAuth.CodeVerifierUtil
import com.truecaller.android.sdk.oAuth.TcOAuthCallback
import com.truecaller.android.sdk.oAuth.TcOAuthData
import com.truecaller.android.sdk.oAuth.TcOAuthError
import com.truecaller.android.sdk.oAuth.TcSdk
import com.truecaller.android.sdk.oAuth.TcSdkOptions
import java.math.BigInteger
import java.security.SecureRandom
import java.util.UUID

// Thin bridge to the Truecaller OAuth SDK. It only collects the authorization
// code; the code -> token -> profile exchange happens in JS (PKCE needs no secret).
class TruecallerModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "TruecallerAuth"

  private fun clientId(): String = reactContext.getString(R.string.truecaller_client_id)

  private fun isConfigured(): Boolean {
    val id = clientId()
    return id.isNotBlank() && !id.startsWith("REPLACE")
  }

  @ReactMethod
  fun isConfigured(promise: Promise) {
    promise.resolve(isConfigured())
  }

  @ReactMethod
  fun authorize(promise: Promise) {
    if (!isConfigured()) {
      promise.reject("NOT_CONFIGURED", "Truecaller client ID is not set.")
      return
    }
    val activity = reactContext.currentActivity as? FragmentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "The app is not in the foreground.")
      return
    }

    val state = BigInteger(130, SecureRandom()).toString(32)
    val codeVerifier = CodeVerifierUtil.generateRandomCodeVerifier()
    var settled = false
    val settle = fun(action: () -> Unit) {
      if (!settled) {
        settled = true
        action()
      }
    }

    val callback = object : TcOAuthCallback {
      override fun onSuccess(tcOAuthData: TcOAuthData) {
        settle {
          if (tcOAuthData.state != state) {
            promise.reject("STATE_MISMATCH", "The sign-in response could not be trusted.")
            return@settle
          }
          val result = Arguments.createMap()
          result.putString("authorizationCode", tcOAuthData.authorizationCode)
          result.putString("codeVerifier", codeVerifier)
          result.putString("clientId", clientId())
          promise.resolve(result)
        }
      }

      override fun onFailure(tcOAuthError: TcOAuthError) {
        settle { promise.reject("TC_${tcOAuthError.errorCode}", tcOAuthError.errorMessage) }
      }

      override fun onVerificationRequired(tcOAuthError: TcOAuthError?) {
        settle { promise.reject("TC_VERIFICATION", "Truecaller could not verify this device.") }
      }
    }

    activity.runOnUiThread {
      try {
        val options = TcSdkOptions.Builder(activity, callback)
          .buttonColor(Color.parseColor("#5B2A86"))
          .buttonTextColor(Color.WHITE)
          .sdkOptions(TcSdkOptions.OPTION_VERIFY_ONLY_TC_USERS)
          .build()
        TcSdk.clear()
        TcSdk.init(options)

        val sdk = TcSdk.getInstance()
        if (!sdk.isOAuthFlowUsable) {
          settle { promise.reject("NOT_AVAILABLE", "Truecaller app is not installed or signed in.") }
          return@runOnUiThread
        }
        sdk.setOAuthState(state)
        sdk.setOAuthScopes(arrayOf("profile", "phone", "openid"))
        val challenge = CodeVerifierUtil.getCodeChallenge(codeVerifier)
        if (challenge == null) {
          settle { promise.reject("NO_CHALLENGE", "This device cannot create a secure sign-in request.") }
          return@runOnUiThread
        }
        sdk.setCodeChallenge(challenge)

        val launcher = activity.activityResultRegistry.register(
          "truecaller-" + UUID.randomUUID(),
          ActivityResultContracts.StartActivityForResult(),
        ) { result ->
          TcSdk.getInstance().onActivityResultObtained(activity, result.resultCode, result.data)
        }
        sdk.getAuthorizationCode(activity, launcher)
      } catch (error: Exception) {
        settle { promise.reject("TC_EXCEPTION", error.message ?: "Truecaller sign-in failed.") }
      }
    }
  }
}
