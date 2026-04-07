import { Moon, Sun, Palette, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme, type Theme } from '@/contexts/theme-context';

const themeConfig = {
  light: {
    icon: Sun,
    label: 'Light Mode',
    description: 'Clean and bright interface'
  },
  dark: {
    icon: Moon,
    label: 'Dark Mode', 
    description: 'Easy on the eyes'
  },
  creative: {
    icon: Palette,
    label: 'Creative Mode',
    description: 'Vibrant and colorful'
  }
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const CurrentIcon = themeConfig[theme].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative transition-all duration-200 hover:scale-105"
        >
          <CurrentIcon className="h-4 w-4 transition-all duration-200" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(themeConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = theme === key;
          
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key as Theme)}
              className={`cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4 mr-3" />
              <div className="flex flex-col">
                <span className="font-medium">{config.label}</span>
                <span className={`text-xs ${
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {config.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}