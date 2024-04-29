var dotacion =
{
    formId:"", form:null,
    url_obtener_almacenes:"",
    url_validar_excedente:"",

    init()
    {
        const ik_empleado = document.getElementById("ik_empleado");
        const ik_insumo = document.getElementById("ik_insumo");
        const txt_unidad = document.getElementById("txt_unidad");
        const btn_submit = document.getElementById("btn_submit");
        this.form = document.getElementById(this.formId);

        if (btn_submit) btn_submit.addEventListener("click", () => this.submit());
        ik_empleado.change_event = (data) => { this.fillSelect("sel_almacen","ialmacen","dalmacen",this.url_obtener_almacenes,{iempleado:data.sys_pk}) }
        ik_insumo.change_event = (data) => { txt_unidad.value = (data.unidad ?? "").toUpperCase() }

        ik_empleado.setValue(ik_empleado.getValue());
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
    },

    submit()
    {
        let endpoint = this.url_validar_excedente;
        let fd = new FormData(this.form);

        const onSuccess = (data) =>
        {
            if (data.message)
            {
                alert(data.message);
                return;
            }

            if (data.excedente && !confirm("El empleado esta excediendo el limite de insumos establecido. ¿Desea continuar?")) return;
            this.form.submit();
        }

        const onFailure = (error) => { alert(error.message ?? JSON.stringify(error)) }

        InduxsoftCrudlModel.InvokeService(endpoint,fd,onSuccess,onFailure,"POST",false,true,"",true);
    },
}