import React from "react";

/*
Se utiliza de la siguiente manera:

<Checked
    id="gerenciachk"
    checked={gerenciaCheck}
    onChange={e => setGerenciaCheck(e.target.checked)}
/>
*/

export default function Checked(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            type="checkbox"
            {...props}
            className={
                "relative mr-2 w-5 h-5 aspect-square !appearance-none !bg-none checked:!bg-gradient-to-tr checked:!from-blue-900 checked:!to-red bg-red border border-gray-300 shadow-sm rounded !outline-none !ring-0 !text-transparent !ring-offset-0 checked:!border-sky-400 hover:!border-sky-400 cursor-pointer transition-all duration-300 ease-in-out focus-visible:!outline-offset-2 focus-visible:!outline-2 focus-visible:!outline-sky-400/30 focus-visible:border-sky-400 after:w-[35%] after:h-[53%] after:absolute after:opacity-0 after:top-[40%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[25deg] after:drop-shadow-[1px_0.5px_1px_rgba(56,149,248,0.5)] after:border-r-[0.20em] after:border-r-white after:border-b-[0.20em] after:border-b-white after:transition-all after:duration-200 after:ease-linear checked:after:opacity-100 checked:after:rotate-45 " +
                (props.className || "")
            }
        />
    );
}