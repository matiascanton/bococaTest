import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import { useDeepCompareEffect } from "@fuse/hooks";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
    selectSlider,
    setSlider,
    resetSlider,
    newSlider,
} from "../store/sliderSlice";
import reducer from "../store";
import SliderHeader from "./SliderHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
    channel: yup.string().required("Debe seleccionar un Canal"),
    gec: yup.string().required("Debe seleccionar un GEC"),
    image: yup.mixed().test("required", "You need to provide a file", (file) => {
        return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});

function SliderConsumer(props) {
    console.log('propppppps', props)
    const dispatch = useDispatch();
    const slider = useSelector(selectSlider);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
    const routeParams = useParams();
    const [noSlider, setnoSlider] = useState(false);
    const methods = useForm({
        mode: "onChange",
        defaultValues: {
            enabled: false,
            image: "",
            channel: "",
            gec: "",
            type: "promotions",
        },
        resolver: yupResolver(schema),
    });
    console.log('slider;', slider)
    const { reset, watch, control, onChange, formState } = methods;
    const form = watch();
    const location = useLocation();

    useDeepCompareEffect(() => {
        function updateSliderState() {
            const { sliderId } = routeParams;
            if (sliderId === "new") {
                dispatch(newSlider());
            } else {
                dispatch(setSlider(location.state));
            }
        }

        updateSliderState();
    }, [dispatch, routeParams, location]);

    useEffect(() => {
        if (!slider) {
            return;
        }
        /**
         * Reset the form on slider state changes
         */
        reset(slider);
    }, [slider, reset]);

    useEffect(() => {
        return () => {
            dispatch(resetSlider());
            setnoSlider(false);
        };
    }, [dispatch]);

    if (noSlider) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-col flex-1 items-center justify-center h-full"
            >
                <Typography color="text.secondary" variant="h5">
                    No hay Slider!
                </Typography>
                <Button
                    className="mt-24"
                    component={Link}
                    variant="outlined"
                    to="/slidersConsumer"
                    color="inherit"
                >
                    Volver a Sliders
                </Button>
            </motion.div>
        );
    }

    if (
        _.isEmpty(form) ||
        (slider &&
            routeParams.sliderId !== slider.id &&
            routeParams.sliderId !== "new" &&
            routeParams.sliderId !== "update" &&
            routeParams.sliderId !== "view")
    ) {
        return <FuseLoading />;
    }

    return (
        <FormProvider {...methods}>
            <FusePageCarded
                header={<SliderHeader params={routeParams.sliderId} type={props.type} />}
                content={<BasicInfo params={routeParams.sliderId} />}
                scroll={isMobile ? "normal" : "content"}
            />
        </FormProvider>
    );
}

export default withReducer("slidersApp", reducer)(SliderConsumer);
