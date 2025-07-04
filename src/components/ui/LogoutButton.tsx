import { useRouter } from 'next/navigation';
import { useAuthApi } from '../../features/auth/hooks';
import { ROUTES } from '../../constants';

interface LogoutButtonProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly variant?: 'default' | 'text' | 'danger';
  readonly onLogoutComplete?: () => void;
}

export const LogoutButton = ({ 
  className = '', 
  children,
  variant = 'default',
  onLogoutComplete 
}: LogoutButtonProps) => {
  const router = useRouter();
  const { logout, isLoading } = useAuthApi();

  const handleLogout = async () => {
    try {
      const success = await logout();
      
      if (onLogoutComplete) {
        onLogoutComplete();
      } else {
        router.push(ROUTES.HOME);
      }
      
      if (!success) {
        console.warn('Déconnexion partielle : erreur API mais token local supprimé');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      if (onLogoutComplete) {
        onLogoutComplete();
      } else {
        router.push(ROUTES.HOME);
      }
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200';
      default:
        return 'bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${getVariantClasses()} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      type="button"
    >
      {children || (isLoading ? 'Déconnexion...' : 'Déconnexion')}
    </button>
  );
}; 