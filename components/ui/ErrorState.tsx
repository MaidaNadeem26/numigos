import type { LucideIcon } from 'lucide-react-native';

import { EmptyState } from '@/components/ui/EmptyState';

export type ErrorStateProps = {
  icon: LucideIcon;
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  icon,
  title = "Couldn't load this content",
  description = 'Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <EmptyState
      actionLabel={onRetry ? 'Try again' : undefined}
      description={description}
      icon={icon}
      onAction={onRetry}
      title={title}
    />
  );
}
