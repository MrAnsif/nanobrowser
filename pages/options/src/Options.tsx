import { useState, useEffect } from 'react';
import '@src/Options.css';
import { Button } from '@extension/ui';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { t } from '@extension/i18n';
import { FiSettings, FiCpu, FiShield, FiTrendingUp, FiHelpCircle, FiUser } from 'react-icons/fi';
import { GeneralSettings } from './components/GeneralSettings';
import { ModelSettings } from './components/ModelSettings';
import { FirewallSettings } from './components/FirewallSettings';
import { AnalyticsSettings } from './components/AnalyticsSettings';
import { ProfileSettings } from './components/ProfileSettings';
import FloatingLines from './component/FloatingLines';

type TabTypes = 'general' | 'models' | 'firewall' | 'analytics' | 'form_data';

const TABS: { id: TabTypes; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'general', icon: FiSettings, label: t('options_tabs_general') },
  { id: 'models', icon: FiCpu, label: t('options_tabs_models') },
  { id: 'firewall', icon: FiShield, label: t('options_tabs_firewall') },
  // { id: 'analytics', icon: FiTrendingUp, label: 'Analytics' },
  { id: 'form_data', icon: FiUser, label: 'Form data' },
  // { id: 'help', icon: FiHelpCircle, label: t('options_tabs_help') },
];

const Options = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>('models');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleTabClick = (tabId: TabTypes) => {
    // if (tabId === 'help') {
    //   window.open('#', '_blank');
    // } else {
    setActiveTab(tabId);
    // }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings isDarkMode={isDarkMode} />;
      case 'models':
        return <ModelSettings isDarkMode={isDarkMode} />;
      case 'firewall':
        return <FirewallSettings isDarkMode={isDarkMode} />;
      // case 'analytics':
      //   return <AnalyticsSettings isDarkMode={isDarkMode} />;
      case 'form_data':
        return <ProfileSettings isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen min-w-[768px] `}>
      <div style={{ width: '100%', height: '100%' }} className="fixed top-0 left-0">
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={[10, 15, 20]}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={[8, 6, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>
      {/* Vertical Navigation Bar */}
      <nav className={`w-52 border-r border-neutral-800 rounded-r-lg bg-black/40 backdrop-blur-lg pointer-events-none`}>
        <div className="p-4 sticky top-0">
          <h1 className={`mb-6 text-xl font-bold text-gray-200`}>{t('options_nav_header')}</h1>
          <ul className="space-y-2">
            {TABS.map(item => (
              <li key={item.id}>
                <Button
                  onClick={() => handleTabClick(item.id)}
                  className={`flex w-full items-center space-x-2 rounded-full px-4 py-2 text-left text-base font-semibold pointer-events-auto
                    ${
                      activeTab !== item.id
                        ? `bg-white/70 text-purple-800 hover:translate-x-1 hover:bg-white/85`
                        : `bg-white/95 text-pink-600  translate-x-3`
                    }`}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 p-8 `}>
        <div className="mx-auto min-w-[512px] max-w-screen-lg">{renderTabContent()}</div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
