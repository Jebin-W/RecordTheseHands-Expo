import { Text } from 'react-native';

export interface PromptCardProps {
  prompt: string;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Text className="font-extrabold text-white" selectable={false}>
      {prompt}
    </Text>
  );
}
