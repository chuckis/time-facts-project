import { createSignal, onCleanup, onMount } from "solid-js";

// Функция для подгрузки JSON с фактами
async function fetchFacts() {
  const response = await fetch("/facts.json");
  const facts = await response.json();
  return facts;
}

function App() {
  const [timeSpent, setTimeSpent] = createSignal(0); // Время на странице
  const [facts, setFacts] = createSignal([]); // Факты из JSON
  const [visibleFacts, setVisibleFacts] = createSignal([]); // Факты для отображения

  // Загружаем факты из JSON при монтировании компонента
  onMount(async () => {
    const loadedFacts = await fetchFacts();
    setFacts(loadedFacts);
  });

  // Увеличиваем время пребывания на странице каждую секунду
  const interval = setInterval(() => {
    setTimeSpent(timeSpent() + 1);

    // Проверяем, есть ли факт, который нужно показать
    const nextFact = facts().find(f => f.time === timeSpent());
    if (nextFact) {
      setVisibleFacts([...visibleFacts(), nextFact]);
    }
  }, 1000);

  // Очищаем интервал при размонтировании
  onCleanup(() => clearInterval(interval));

  return (
    <>
      <div class="timer-header">
        Время на странице: {timeSpent()} сек.
      </div>
      <div class="content">
        {visibleFacts().map(fact => (
          <div class="fact">
            <strong>{fact.time} мин:</strong> {fact.fact}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
