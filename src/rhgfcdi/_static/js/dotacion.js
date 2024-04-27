var dotacion =
{
    url_obtener_almacenes:"",

    init()
    {
        const ik_empleado = document.getElementById("ik_empleado");
        const ik_insumo = document.getElementById("ik_insumo");
        const txt_unidad = document.getElementById("txt_unidad");

        ik_empleado.addEventListener("change", (data) => { this.fillSelect("sel_almacen","ialmacen","dalmacen",this.url_obtener_almacenes,{iempleado:data.sys_pk}) });
        ik_insumo.addEventListener("change", (data) => { txt_unidad.value = (data.unidad ?? "").toUpperCase() });
    },

    fillSelect(id, kf, vf, url, params={})
    {
        const select = document.getElementById(id);

        let endpoint = InduxsoftCrudlModel.UrlReplace(url,params);
        let selected = select.value ?? "";

        fetch(endpoint).then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                return;
            }

            select.innerHTML = "";
            data.forEach(obj => {
                const option = document.createElement("option");
                option.value = obj[kf];
                option.text = obj[vf];
                if (obj[kf] === selected) option.selected = true;

                select.appendChild(option);
            });
        })
        .catch(error => console.error(error));
    }
}