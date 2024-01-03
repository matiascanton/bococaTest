
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import StocksHeader from "./StocksHeader";
import StocksTable from "./StocksTable";
import { updateStock } from './store/stockSlice';
import { useDispatch } from "react-redux";

function Stocks() {
    const [datos, setDatos] = useState([]);
    const dispatch = useDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    const handleInputChange = (e, sku) => {
        const newValue = parseInt(e.target.value);
        const updatedDatos = [...datos];
        const existingIndex = updatedDatos.findIndex((item) => item.sku === sku);

        if (existingIndex !== -1) {
            // Si el SKU ya existe en el estado, actualiza su cantidad
            updatedDatos[existingIndex].qty = newValue;
        } else {
            // Si el SKU no existe en el estado, agrega un nuevo objeto
            updatedDatos.push({ sku: sku, qty: newValue });
        }

        setDatos(updatedDatos);
    };

    const handleGuardar = () => {
        console.log('datossssss', datos);

        dispatch(updateStock(datos)).then((res) => {
            navigate("/stocks");
        });

    };


    return (
        <FusePageCarded
            header={<StocksHeader handleGuardar={handleGuardar} />}
            content={<StocksTable handleInputChange={handleInputChange} />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("stocksApp", reducer)(Stocks);
