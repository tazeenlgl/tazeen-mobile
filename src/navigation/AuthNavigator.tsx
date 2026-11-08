import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GameHubScreen from '../screens/GameHubScreen';
import SideDrawer from '../components/home/SideDrawer';
import StopwatchGameScreen from '../screens/StopwatchGameScreen';
import SpinWinGameScreen from '../screens/SpinWinGameScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChangePinScreen from '../screens/ChangePinScreen';
import AddressesScreen from '../screens/AddressesScreen';
import AddressFormScreen from '../screens/AddressFormScreen';
import ChangePhoneScreen from '../screens/ChangePhoneScreen';
import AboutTazeenScreen from '../screens/AboutTazeenScreen';
import CompanyDetailsScreen from '../screens/CompanyDetailsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import HelpScreen from '../screens/HelpScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ReturnRequestScreen from '../screens/ReturnRequestScreen';
import ReturnPolicyScreen from '../screens/ReturnPolicyScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import { NotificationProvider } from '../context/NotificationContext';
import { WishlistProvider } from '../context/WishlistContext';
import type { Order } from '../types/order';
import { AddressProvider } from '../context/AddressContext';
import { OrderProvider } from '../context/OrderContext';
import type { Address } from '../types/address';
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
  | 'Wishlist'
  | 'Help'
  | 'Checkout'
  | 'OrderConfirmation'
  | 'OrderDetails'
  | 'ReturnRequest'
  | 'ReturnPolicy'
  | 'Notifications'
  | 'SettingsMenu'
  | 'ChangePin'
  | 'Addresses'
  | 'AddressForm'
  | 'ChangePhone'
  | 'About'
  | 'Company'
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
  const [pinReturn, setPinReturn] = useState<AuthScreen>('SettingsMenu');
  const [companyReturn, setCompanyReturn] = useState<AuthScreen>('Home');
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [orderReturn, setOrderReturn] = useState<AuthScreen>('Orders');
  const [addressesReturn, setAddressesReturn] = useState<AuthScreen>('Profile');
  const [policyReturn, setPolicyReturn] = useState<AuthScreen>('Home');
  const { addToCart } = useCart();
  const { logout: authLogout, isLoggedIn, ready } = useAuth();
  const restored = React.useRef(false);

  // Returning shoppers go straight in instead of seeing Login again.
  useEffect(() => {
    if (ready && isLoggedIn && !restored.current) {
      restored.current = true;
      setScreen(current => (current === 'Login' ? 'Home' : current));
    }
  }, [ready, isLoggedIn]);

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
          setScreen(pinReturn);
          return true;
        }
        if (screen === 'Addresses') {
          setScreen(addressesReturn);
          return true;
        }
        if (screen === 'ChangePhone') {
          setScreen('Profile');
          return true;
        }
        if (screen === 'Wishlist' || screen === 'Notifications' || screen === 'Help') {
          setScreen('Home');
          return true;
        }
        if (screen === 'Checkout') {
          setScreen('Cart');
          return true;
        }
        if (screen === 'OrderConfirmation') {
          setScreen('Home');
          return true;
        }
        if (screen === 'OrderDetails') {
          setScreen(orderReturn);
          return true;
        }
        if (screen === 'ReturnRequest') {
          setScreen('OrderDetails');
          return true;
        }
        if (screen === 'ReturnPolicy') {
          setScreen(policyReturn);
          return true;
        }
        if (screen === 'AddressForm') {
          setScreen('Addresses');
          return true;
        }
        if (screen === 'About') {
          setScreen('Home');
          return true;
        }
        if (screen === 'Company') {
          setScreen(companyReturn);
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
  }, [screen, drawerOpen, cartReturn, detailsReturn, pinReturn, companyReturn, addressesReturn, orderReturn, policyReturn]);

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
        onCheckout={() => setScreen('Checkout')}
      />;
  }

  if (screen === 'Checkout') {
    return (
      <CheckoutScreen
        onBack={() => setScreen('Cart')}
        onCartPress={() => setScreen('Cart')}
        onManageAddresses={() => {
          setAddressesReturn('Checkout');
          setScreen('Addresses');
        }}
        onPlaced={order => {
          setPlacedOrder(order);
          setScreen('OrderConfirmation');
        }}
      />
    );
  }

  if (screen === 'OrderConfirmation' && placedOrder) {
    return (
      <OrderConfirmationScreen
        order={placedOrder}
        onTrack={() => {
          setActiveOrderId(placedOrder.id);
          setOrderReturn('Orders');
          setScreen('OrderDetails');
        }}
        onContinue={() => setScreen('Home')}
      />
    );
  }

  if (screen === 'Help') {
    return (
      <HelpScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
        onOpenPolicy={() => {
          setPolicyReturn('Help');
          setScreen('ReturnPolicy');
        }}
      />
    );
  }

  if (screen === 'Wishlist') {
    return (
      <WishlistScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
        onSelectProduct={openProductDetails}
        onBrowseProducts={() => setScreen('Products')}
      />
    );
  }

  if (screen === 'Notifications') {
    return (
      <NotificationsScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
        onOpenOrder={id => {
          setActiveOrderId(id);
          setOrderReturn('Notifications');
          setScreen('OrderDetails');
        }}
      />
    );
  }

  if (screen === 'OrderDetails') {
    return (
      <OrderDetailsScreen
        orderId={activeOrderId}
        onBack={() => setScreen(orderReturn)}
        onCartPress={() => openCart()}
        onReturn={() => setScreen('ReturnRequest')}
        onOpenPolicy={() => {
          setPolicyReturn('OrderDetails');
          setScreen('ReturnPolicy');
        }}
      />
    );
  }

  if (screen === 'ReturnRequest') {
    return (
      <ReturnRequestScreen
        orderId={activeOrderId}
        onBack={() => setScreen('OrderDetails')}
        onCartPress={() => openCart()}
        onDone={() => setScreen('OrderDetails')}
        onOpenPolicy={() => {
          setPolicyReturn('ReturnRequest');
          setScreen('ReturnPolicy');
        }}
      />
    );
  }

  if (screen === 'ReturnPolicy') {
    return (
      <ReturnPolicyScreen onBack={() => setScreen(policyReturn)} onCartPress={() => openCart()} />
    );
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
        onBuyNow={() => {
          setCartReturn('ProductDetails');
          setScreen('Checkout');
        }}
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
      <OrdersScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
        onBrowseProducts={() => setScreen('Products')}
        onOpenOrder={id => {
          setActiveOrderId(id);
          setOrderReturn('Orders');
          setScreen('OrderDetails');
        }}
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
            setPinReturn('SettingsMenu');
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

  if (screen === 'Addresses') {
    return (
      <AddressesScreen
        onBack={() => setScreen(addressesReturn)}
        onCartPress={() => openCart()}
        onAdd={() => {
          setEditingAddress(undefined);
          setScreen('AddressForm');
        }}
        onEdit={address => {
          setEditingAddress(address);
          setScreen('AddressForm');
        }}
      />
    );
  }

  if (screen === 'AddressForm') {
    return (
      <AddressFormScreen
        key={editingAddress?.id ?? 'new'}
        address={editingAddress}
        onBack={() => setScreen('Addresses')}
        onCartPress={() => openCart()}
        onSaved={() => setScreen('Addresses')}
      />
    );
  }

  if (screen === 'ChangePhone') {
    return (
      <ChangePhoneScreen
        onBack={() => setScreen('Profile')}
        onCartPress={() => openCart()}
        onDone={() => setScreen('Profile')}
      />
    );
  }

  if (screen === 'About') {
    return (
      <AboutTazeenScreen
        onBack={() => setScreen('Home')}
        onCartPress={() => openCart()}
        onOpenCompany={() => {
          setCompanyReturn('About');
          setScreen('Company');
        }}
      />
    );
  }

  if (screen === 'Company') {
    return (
      <CompanyDetailsScreen
        onBack={() => setScreen(companyReturn)}
        onCartPress={() => openCart()}
      />
    );
  }

  if (screen === 'ChangePin') {
    return (
      <ChangePinScreen
        onBack={() => setScreen(pinReturn)}
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
        onOpenAddresses={() => {
          setAddressesReturn('Profile');
          setScreen('Addresses');
        }}
        onOpenChangePhone={() => setScreen('ChangePhone')}
        onOpenChangePin={() => {
          setPinReturn('Profile');
          setScreen('ChangePin');
        }}
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
          if (key === 'notifications') {
            setScreen('Notifications');
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
          if (key === 'addresses') {
            setAddressesReturn('Home');
            setScreen('Addresses');
          }
          if (key === 'wishlist') {
            setScreen('Wishlist');
          }
          if (key === 'help') {
            setScreen('Help');
          }
          if (key === 'notifications') {
            setScreen('Notifications');
          }
          if (key === 'returnpolicy') {
            setPolicyReturn('Home');
            setScreen('ReturnPolicy');
          }
          if (key === 'about') {
            setScreen('About');
          }
          if (key === 'company') {
            setCompanyReturn(screen === 'About' ? 'About' : 'Home');
            setScreen('Company');
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
      <AddressProvider>
        <OrderProvider>
          <NotificationProvider>
            <WishlistProvider>
              <AuthNavigatorContent />
            </WishlistProvider>
          </NotificationProvider>
        </OrderProvider>
      </AddressProvider>
    </AuthProvider>
  );
}
