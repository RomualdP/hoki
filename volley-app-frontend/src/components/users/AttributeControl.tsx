import { Button } from "../ui";

interface AttributeControlProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function AttributeControl({
  label,
  value,
  onChange,
  min = 0,
  max = 2,
  step = 0.05,
  disabled = false,
}: AttributeControlProps) {
  const handleDecrement = () => {
    const newValue = Math.max(min, Number((value - step).toFixed(2)));
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, Number((value + step).toFixed(2)));
    onChange(newValue);
  };

  const getProgressColor = () => {
    const percentage = (value / max) * 100;
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const progressPercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {value?.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          -
        </Button>

        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          +
        </Button>
      </div>
    </div>
  );
}
