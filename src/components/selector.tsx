import React from "react";
import { Breather } from "@/components/breather";
import type { Action } from "@/lib/action";
import { Button } from "./ui/button";
import { CircleQuestionMark, Undo2, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Sequence } from "./sequence";
import "./selector.css";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import useLocalStorage from "use-local-storage";

interface Option {
  label: React.ReactNode;
  actions: Action[];
  description: React.ReactNode;
}

const options: Record<string, Option> = {
  "4-7-8": {
    label: <Sequence values={[4, 7, 8]} />,
    actions: [
      { type: "in", duration: 4 },
      { type: "hold in", duration: 7 },
      { type: "out", duration: 8 },
    ],
    description: (
      <>
        <h1>Когда применять</h1>
        <h2>Во время беременности</h2>
        <p>При тревоге, эмоциональном напряжении, бессоннице.</p>
        <h2>В латентной фазе родов</h2>
        <p>Для вхождения в спокойное, устойчивое состояние.</p>
        <h1>Суть техники</h1>
        <p>
          Метод основан на древней индийской практике пранаямы, осознанного
          дыхания, регулирующего жизненную энергию.
        </p>
        <h1>Как выполнять</h1>
        <ol>
          <li>
            Сядь с прямой спиной, поставив стопы на пол. Можно делать технику и
            лёжа, и стоя, и даже в движении.
          </li>
          <li>
            Кончик языка помести на бугорок за верхними передними зубами и
            удерживай его там весь цикл. (Если не удобно, можно и не делать так)
          </li>
          <li>Полный выдох ртом с лёгким шумом освобождаем лёгкие.</li>
          <li>Вдох через нос на счёт 4.</li>
          <li>Задержка дыхания на счёт 7.</li>
          <li>Медленный, шумный выдох через рот на счёт 8.</li>
          <li>Повторить 4 цикла.</li>
        </ol>
        <h1>Важно помнить</h1>
        <ol>
          <li>
            Вдохи только носом, выдох только ртом. Если нос не дышит, вдыхаем
            через рот.
          </li>
          <li>Длина выдоха в 2 раза больше, чем вдоха.</li>
          <li>
            Главное, соблюдать соотношение 4-7-8. Если трудно, можно ускорить
            счёт.
          </li>
          <li>
            Выполняй технику 1–2 раза в день, особенно если чувствуешь волнение.
          </li>
        </ol>
      </>
    ),
  },

  "4-4-4-4": {
    label: "Квадрат",
    actions: [
      { type: "in", duration: 4 },
      { type: "hold in", duration: 4 },
      { type: "out", duration: 4 },
      { type: "hold out", duration: 4 },
    ],
    description: (
      <>
        <h1>Когда применять</h1>
        <ol>
          <li>В беременность при тревоге, раздражении, бессоннице.</li>
          <li>
            В родах, особенно в переходе от латентной к активной фазе, когда
            хочется "собрать себя".
          </li>
          <li>
            Простой и эффективный способ привести дыхание, тело и мысли в
            равновесие.
          </li>
        </ol>

        <h1>Как выполнять</h1>
        <ol>
          <li>Найди взглядом квадрат, прямоугольник (дверь, окно, экран).</li>
          <li>Посмотри в верхний левый угол — вдох, считай до 4.</li>
          <li>Верхний правый угол — задержка дыхания, счёт до 4.</li>
          <li>Нижний правый угол — выдох, счёт до 4.</li>
          <li>Нижний левый угол — задержка с пустыми лёгкими, счёт до 4.</li>
        </ol>
        <p>Повтори 10 циклов.</p>

        <h1>Важно</h1>
        <ol>
          <li>Используй дыхание животом.</li>
          <li>
            Постепенно можно увеличивать счёт до 6, 8, а затем до 10 секунд на
            каждую сторону квадрата.
          </li>
          <li>
            Главное: внутренний комфорт. Не стремись к идеалу, доверься ритму
            своего тела.
          </li>
        </ol>
      </>
    ),
  },

  "4-8": {
    label: <Sequence values={[4, 8]} />,
    actions: [
      { type: "in", duration: 4 },
      { type: "out", duration: 8 },
    ],
    description: (
      <>
        <p>Базовое дыхание на схватках (латентная фаза)</p>

        <h1>Когда применять</h1>
        <ol>
          <li>При тренировочных схватках.</li>
          <li>
            В начале родов, для расслабления, помощи в раскрытии шейки матки.
          </li>
          <li>При тренировке навыка “Окситоциновый час”.</li>
        </ol>

        <h1>Как выполнять</h1>
        <ol>
          <li>
            Вдох через нос (если заложен, можно через рот), спокойный,
            комфортный.
          </li>
          <li>
            Желательно делать вдох носом и направлять воздух в нижнюю часть
            грудной клетки или в живот (представь, что надуваешь шарик в
            животе).
          </li>
          <li>
            Выдох обязательно через расслабленный рот, в 2 раза длиннее вдоха (
            вдох 4 сек / выдох 8 сек).
          </li>
          <li>Чем длиннее выдох, тем будет глубже расслабление.</li>
          <li>
            На выдохе мягко расслабляем мышцы лица, ладони, плечи, ягодицы.
          </li>
          <li>
            Это дыхание нужно практиковать ещё в беременность во время
            “Окситоцинового часа” и использовать в латентной фазе родов.
          </li>
        </ol>
      </>
    ),
  },

  "4-10-3": {
    label: <Sequence values={[4, 10, 3]} />,
    actions: [
      { type: "in", duration: 4 },
      { type: "hold in", duration: 10 },
      { type: "out", duration: 3 },
    ],
    description: (
      <>
        <p>Форсированное потужное дыхание</p>

        <h1>Когда применять</h1>
        <p>При отсутствии своих потуг, например:</p>
        <ol>
          <li>После эпидуральной анестезии</li>
          <li>При снижении сердцебиения малыша (дистресс)</li>
          <li>При необходимости помочь родиться малышу быстрее</li>
        </ol>

        <h1>Как выполнять</h1>
        <ol>
          <li>
            Вдох (примерно 4 секунды). Глубокий вдох через нос или рот (как
            удобнее).
          </li>
          <li>Задержка дыхания с потужным движением вниз (10–12 секунд)</li>
          <li>
            Воздух удерживаем внутри, не выпускаем ни через нос, ни через рот.
          </li>
          <li>Голосовая щель закрыта, звук не издаётся.</li>
          <li>Губы не смыкаем, остаются мягко приоткрыты, в “улыбке”.</li>
          <li>Лицо и щеки расслаблены.</li>
          <li>
            При этом работает живот: мышцы брюшного пресса напрягаются, как
            поршень, выталкивающий малыша вниз, ощущение, как при дефекации
            (по-большому в туалет).
          </li>
          <li>Ягодицы постараться расслабить, сила идёт только из живота.</li>
          <li>Мягкий выдох (примерно 3 секунды).</li>
          <li>
            Не “бросаем” потугу, иначе из-за перепада давления головка малыша
            может немного отойти назад.
          </li>
          <li>Представь, что выдыхаешь через соломинку вниз в живот.</li>
        </ol>

        <h1>Итак</h1>
        <ol>
          <li>Один цикл: вдох — задержка с потугой — мягкий выдох.</li>
          <li>
            В одну потугу желательно сделать 3 таких дыхательных цикла подряд.
          </li>
          <li>
            Между потугами отдых, восстановление дыхания. Можно вдыхать масло
            мяты, оно дает силы для следующей потуги.
          </li>
        </ol>
      </>
    ),
  },
};

const defaultCountDurationSeconds = 1;
const defaultWaitDurationSeconds = 0.3;

export const Selector: React.FC = () => {
  const [countDurationSeconds, setCountDurationSeconds] = useLocalStorage(
    "count-duration-seconds",
    defaultCountDurationSeconds
  );
  const [waitDurationSeconds, setWaitDurationSeconds] = useLocalStorage(
    "wait-duration-seconds",
    defaultWaitDurationSeconds
  );
  const [key, setKey] = React.useState<keyof typeof options>("4-7-8");

  const resetDurations = () => {
    setCountDurationSeconds(defaultCountDurationSeconds);
    setWaitDurationSeconds(defaultWaitDurationSeconds);
  };

  const durationsAtDefault =
    countDurationSeconds === defaultCountDurationSeconds &&
    waitDurationSeconds === defaultWaitDurationSeconds;

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex flex-wrap gap-2 p-2 justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs opacity-40">
              <Wrench />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Настройки</DialogTitle>
            <div className="flex flex-col gap-6 pt-2">
              <div className="flex flex-col gap-4">
                <Label className="text-violet-300">
                  <span>Один счет</span>
                  <div className="ml-auto">{countDurationSeconds} с</div>
                </Label>
                <Slider
                  value={[countDurationSeconds]}
                  onValueChange={(v) => setCountDurationSeconds(v[0])}
                  min={0.5}
                  max={2.5}
                  step={0.1}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label className="text-violet-300">
                  <span>Перерыв</span>
                  <div className="ml-auto">{waitDurationSeconds} с</div>
                </Label>
                <Slider
                  value={[waitDurationSeconds]}
                  onValueChange={(v) => setWaitDurationSeconds(v[0])}
                  min={0.1}
                  max={1}
                  step={0.1}
                />
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDurations}
                  disabled={durationsAtDefault}
                >
                  <Undo2 />
                  Сброс
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs opacity-40">
              <CircleQuestionMark />
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-scroll">
            <DialogTitle>{options[key].label}</DialogTitle>
            <div className="description">{options[key].description}</div>
          </DialogContent>
        </Dialog>

        {Object.keys(options)
          .sort()
          .map((k) => (
            <Button
              key={k}
              variant="ghost"
              size="sm"
              className="text-xs opacity-20"
              onClick={() => setKey(k)}
              disabled={key === k}
            >
              {options[k].label}
            </Button>
          ))}
      </div>

      <Breather
        countDurationSeconds={countDurationSeconds}
        waitDurationSeconds={waitDurationSeconds}
        actions={options[key].actions}
      />
    </div>
  );
};
