type RatingProps = {
  value: number;
};

export function Scale({ value }: RatingProps) {
  return (
    <div className="flex gap-6">
      {Array.from({ length: 5 }).map((_, i) => {
        const fillAmount = Math.min(Math.max(value - i, 0), 1);

        return (
          <div
            key={i}
            className="w-5 h-5 rounded-full relative overflow-hidden bg-gray-300 border-2 border-black"
          >
            <div
              style={{
                width: `${fillAmount * 100}%`,
                height: '100%',
                background: '#222',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
