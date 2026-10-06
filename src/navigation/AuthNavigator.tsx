import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import GameHubScreen from '../screens/GameHubScreen';
import SideDrawer from '../components/home/SideDrawer';
import StopwatchGameScreen from '../screens/StopwatchGameScreen';
import SpinWinGameScreen from '../screens/SpinWinGameScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChangePinScreen from '../screens/ChangePinScreen';
import type { GameScreenKey } from '../types/game';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import SuitTryOnCaptureScreen from '../screens/SuitTryOnCaptureScreen';
import SuitTryOnPreviewScreen from '../screens/SuitTryOnPreviewScreen';
import SuitTryOnResultScreen from '../screens/SuitTryOnResultScreen';
import { useCart } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import type { Product } from '../types/product';

type AuthScreen =
  | 'Login'
  | 'ForgotPassword'
  | 'SignUp'
  | 'Home'
  | 'Products'
  | 'Rewards'
  | 'Profile'
  | 'Orders'
  | 'SettingsMenu'
  | 'ChangePin'
  | 'TermsOfUse'
  | 'PrivacyPolicy'
  | 'Game'
  | 'StopwatchGame'
  | 'SpinWinGame'
  | 'Leaderboard'
  | 'ProductDetails'
  | 'Cart'
  | 'TryOnCapture'
  | 'TryOnPreview'
  | 'TryOnResult';

function AuthNavigatorContent() {
  const [screen, setScreen] = useState<AuthScreen>('Login');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [tryOnPhotoUri, setTryOnPhotoUri] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartReturn, setCartReturn] = useState<AuthScreen>('Products');
  const [detailsReturn, setDetailsReturn] = useState<AuthScreen>('Products');
  const { addToCart } = useCart();
  const { logout: authLogout } = useAuth();

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (drawerOpen) {
          setDrawerOpen(false);
          return true;
        }
        if (screen === 'ForgotPassword' || screen === 'SignUp') {
          setScreen('Login');
          return true;
        }
        if (screen === 'Products') {
          setScreen('Home');
          return true;
        }
        if (
          screen === 'Rewards' ||
          screen === 'Profile' ||
          screen === 'Orders' ||
          screen === 'SettingsMenu' ||
          screen === 'TermsOfUse' ||
          screen === 'PrivacyPolicy'
        ) {
          setScreen('Home');
          return true;
        }
        if (screen === 'ChangePin') {
          setScreen('SettingsMenu');
          return true;
        }
        if (screen === 'Game') {
          setScreen('Home');
          return true;
        }
        if (
          screen === 'StopwatchGame' ||
          screen === 'SpinWinGame' ||
          screen === 'Leaderboard'
        ) {
          setScreen('Game');
          return true;
        }
        if (screen === 'ProductDetails') {
          setScreen(detailsReturn);
          return true;
        }
        if (screen === 'Cart') {
          setScreen(cartReturn);
          return true;
        }
        if (screen === 'TryOnCapture') {
          setScreen('ProductDetails');
          return true;
        }
        if (screen === 'TryOnPreview') {
          setScreen('TryOnCapture');
          return true;
        }
        if (screen === 'TryOnResult') {
          setScreen('ProductDetails');
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [screen, drawerOpen, cartReturn, detailsReturn]);

  const openCart = () => {
    if (screen !== 'Cart') {
      setCartReturn(screen === 'TryOnResult' ? 'ProductDetails' : screen);
    }
    setScreen('Cart');
  };

  const openProductDetails = (product: Product) => {
    if (screen === 'Home' || screen === 'Products') {
      setDetailsReturn(screen);
    }
    setCurrentProduct(product);
    setScreen('ProductDetails');
  };

  useEffect(() => {
    setDrawerOpen(false);
  }, [screen]);

  const renderScreen = (): React.ReactElement => {
  if (screen === 'ForgotPassword') {
    return <ForgotPasswordScreen onLogin={() => setScreen('Login')} />;
  }

  if (screen === 'SignUp') {
    return <SignUpScreen onLogin={() => setScreen('Login')} />;
  }

  if (screen === 'Cart') {
    return <CartScreen
        onBack={() => setScreen(cartReturn)}
        onMenuPress={() => setDrawerOpen(true)}
        onBrowseProducts={() => setScreen('Products')}
      />;
  }

  if (screen === 'TryOnCapture' && tryOnProduct) {
    return (
      <SuitTryOnCaptureScreen
        onBack={() => setScreen('ProductDetails')}
        onCaptured={uri => {
          setTryOnPhotoUri(uri);
          setScreen('TryOnPreview');
        }}
      />
    );
  }

  if (screen === 'TryOnPreview' && tryOnPhotoUri) {
    return (
      <SuitTryOnPreviewScreen
        photoUri={tryOnPhotoUri}
        onRetake={() => {
          setTryOnPhotoUri(null);
          setScreen('TryOnCapture');
        }}
        onContinue={() => setScreen('TryOnResult')}
      />
    );
  }

  if (screen === 'TryOnResult' && tryOnProduct && tryOnPhotoUri) {
    return (
      <SuitTryOnResultScreen
        product={tryOnProduct}
        customerFaceUri={tryOnPhotoUri}
        onTryAnotherPhoto={() => {
          setTryOnPhotoUri(null);
          setScreen('TryOnCapture');
        }}
        onAddToCart={result => {
          const size =
            tryOnProduct.sizes.length === 0 ? 'One Size' : tryOnProduct.sizes[0];
          addToCart(tryOnProduct, size, undefined, result);
          openCart();
        }}
      />
    );
  }

  if (screen === 'ProductDetails' && currentProduct) {
    return (
      <ProductDetailsScreen
        product={currentProduct}
        onSelectProduct={openProductDetails}
        onAddToCart={() => openCart()}
        onBack={() => setScreen(detailsReturn)}
        onCartPress={() => openCart()}
        onTryItOn={product => {
          setTryOnProduct(product);
          setTryOnPhotoUri(null);
          setScreen('TryOnCapture');
        }}
      />
    );
  }

  if (screen === 'StopwatchGame') {
    return <StopwatchGameScreen onBack={() => setScreen('Game')} />;
  }

  if (screen === 'SpinWinGame') {
    return <SpinWinGameScreen onBack={() => setScreen('Game')} />;
  }

  if (screen === 'Leaderboard') {
    return <LeaderboardScreen onBack={() => setScreen('Game')} />;
  }

  if (screen === 'Game') {
    return (
      <GameHubScreen
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={key => {
          if (key === 'home') {
            setScreen('Home');
          }
          if (key === 'products') {
            setScreen('Products');
          }
          if (key === 'rewards') {
            setScreen('Rewards');
          }
          if (key === 'profile') {
            setScreen('Profile');
          }
        }}
        onCartPress={() => openCart()}
        onOpenGame={(gameScreen: GameScreenKey) => setScreen(gameScreen)}
        onOpenLeaderboard={() => setScreen('Leaderboard')}
      />
    );
  }

  if (screen === 'Rewards') {
    return (
      <RewardsScreen
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={key => {
          if (key === 'home') {
            setScreen('Home');
          }
          if (key === 'products') {
            setScreen('Products');
          }
          if (key === 'game') {
            setScreen('Game');
          }
          if (key === 'profile') {
            setScreen('Profile');
          }
        }}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'Orders') {
    return (
      <PlaceholderScreen
        title={screen}
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'SettingsMenu') {
    return (
      <SettingsScreen
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={key => {
          if (key === 'changepin') {
            setScreen('ChangePin');
          }
          if (key === 'termsofuse') {
            setScreen('TermsOfUse');
          }
          if (key === 'privacypolicy') {
            setScreen('PrivacyPolicy');
          }
        }}
        onCartPress={() => openCart()}
        onBack={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'ChangePin') {
    return (
      <ChangePinScreen
        onBack={() => setScreen('SettingsMenu')}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'TermsOfUse') {
    return (
      <TermsOfUseScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'PrivacyPolicy') {
    return (
      <PrivacyPolicyScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'Profile') {
    return (
      <ProfileScreen
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={key => {
          if (key === 'home') {
            setScreen('Home');
          }
          if (key === 'products') {
            setScreen('Products');
          }
          if (key === 'game') {
            setScreen('Game');
          }
          if (key === 'rewards') {
            setScreen('Rewards');
          }
        }}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'Products') {
    return (
      <ProductsScreen
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={key => {
          if (key === 'home') {
            setScreen('Home');
          }
          if (key === 'rewards') {
            setScreen('Rewards');
          }
          if (key === 'game') {
            setScreen('Game');
          }
          if (key === 'profile') {
            setScreen('Profile');
          }
        }}
        onSelectProduct={openProductDetails}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'Home') {
    return (
      <HomeScreen
        drawerOpen={drawerOpen}
        onMenuPress={() => setDrawerOpen(true)}
        onDrawerClose={() => setDrawerOpen(false)}
        onNavigate={key => {
          if (key === 'products') {
            setScreen('Products');
          }
          if (key === 'rewards') {
            setScreen('Rewards');
          }
          if (key === 'game') {
            setScreen('Game');
          }
          if (key === 'profile') {
            setScreen('Profile');
          }
          if (key === 'orders') {
            setScreen('Orders');
          }
          if (key === 'settings') {
            setScreen('SettingsMenu');
          }
          if (key === 'logout') {
            authLogout();
            setScreen('Login');
          }
        }}
        onSelectProduct={openProductDetails}
        onCartPress={() => openCart()}
      />
    );
  }

  return (
    <LoginScreen
      onForgotPassword={() => setScreen('ForgotPassword')}
      onSignUp={() => setScreen('SignUp')}
      onLogin={() => setScreen('Home')}
      onNavigate={key => {
        if (key === 'termsofuse') {
          setScreen('TermsOfUse');
        }
        if (key === 'privacypolicy') {
          setScreen('PrivacyPolicy');
        }
      }}
    />
  );
  };

  const isLoggedInScreen: boolean =
    (screen as AuthScreen) !== 'Login' &&
    (screen as AuthScreen) !== 'ForgotPassword' &&
    (screen as AuthScreen) !== 'SignUp';

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <SideDrawer
        visible={drawerOpen}
        isLoggedIn={isLoggedInScreen as boolean}
        onClose={() => setDrawerOpen(false)}
        onSelect={key => {
          setDrawerOpen(false);
          if (key === 'orders') {
            setScreen('Orders');
          }
          if (key === 'settings') {
            setScreen('SettingsMenu');
          }
          if (key === 'login') {
            setScreen('Login');
          }
          if (key === 'logout') {
            authLogout();
            setScreen('Login');
          }
          if (key === 'termsofuse') {
            setScreen('TermsOfUse');
          }
          if (key === 'privacypolicy') {
            setScreen('PrivacyPolicy');
          }
        }}
      />
    </View>
  );
}

export default function AuthNavigator() {
  return (
    <AuthProvider>
      <AuthNavigatorContent />
    </AuthProvider>
  );
}
