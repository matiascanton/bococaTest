import { lazy } from "react";

const Sliders = lazy(() => import("./Sliders"));
const SliderConsumer = lazy(() => import("./slider/SliderConsumer"));

const SlidersConsumerConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: "slidersConsumer",
            element: <Sliders type={'consumers'} />,
        },
        {
            path: "slidersConsumer/:sliderId",
            element: <SliderConsumer type={'consumers'} />,
        },
    ],
};

export default SlidersConsumerConfig;
