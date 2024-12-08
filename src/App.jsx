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
    const [visibleFact, setVisibleFact] = createSignal(null); // Отображаемый факт

    // Загружаем факты из JSON при монтировании компонента
    onMount(async () => {
        const loadedFacts = await fetchFacts();
        setFacts(loadedFacts);
    });

    // Обновляем таймер каждую секунду
    const interval = setInterval(() => {
        setTimeSpent(timeSpent() + 1);

        // Проверяем, есть ли факт, который нужно показать
        const nextFact = facts().find(f => f.time === Math.floor(timeSpent() / 60));
        if (nextFact && nextFact !== visibleFact()) {
            setVisibleFact(nextFact);
        }
    }, 1000);

    // Убираем отображаемый факт при прокрутке
    const handleScroll = () => {
        if (visibleFact()) {
            setVisibleFact(null);
        }
    };

    // Добавляем обработчик события прокрутки
    window.addEventListener("scroll", handleScroll);

    // Очищаем интервал и обработчик событий при размонтировании
    onCleanup(() => {
        clearInterval(interval);
        window.removeEventListener("scroll", handleScroll);
    });

    return (
        <>
          <div class="timer-header">
            Время на странице: {Math.floor(timeSpent() / 60)} мин {timeSpent() % 60} сек
          </div>
          <div class="content">
            {visibleFact() && (
              <div class="fact">
                <strong>{visibleFact().time} мин:</strong> {visibleFact().fact}
              </div>
            )}
          </div>
        </>
      );
    }
export default App;