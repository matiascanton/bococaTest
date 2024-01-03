import _ from "@lodash";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import UploadImageHeader from "./UploadImageHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  images: yup.mixed().test("required", "You need to provide a file", (file) => {
    return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
  }),
});

function UploadImage(props) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
     images:[]
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<UploadImageHeader />}
        content={<BasicInfo />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("bingosApp", reducer)(UploadImage);
