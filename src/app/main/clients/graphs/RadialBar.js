import { useState } from 'react';
import Chart from 'react-apexcharts';

function RadialBar(props) {
    const { data, title } = props;
    const [state, setState] = useState({
        options: {
            labels: [title],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '40%',
                    }
                },
            },
        },
        series: [data],
    });

    return (
        <div className="radialbar">
            <Chart options={state.options} series={state.series} type="radialBar" height="380" />
        </div>
    );
}

export default RadialBar;