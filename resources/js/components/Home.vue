<template>
<v-app>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
       <v-col cols="12" md="4">
            <v-form ref="form"  v-model="valid" lazy-validation >

                    <v-date-picker v-model="fecha" required></v-date-picker>

                    <v-text-field v-model="monto" :rules="montoRules" required label="Monto"  ></v-text-field>

                    <v-btn class="mr-4" @click="agregar" > Agregar </v-btn>

            </v-form>     
        </v-col>

        <v-col cols="12" md="8">
            <div class="chart-monto-diario" ref="chartdiv"> </div>
        </v-col>

    </v-row>
  </v-container>
</v-app>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
    name:'compras',
   data: () => ({
        valid: true,
        monto: 0,
        montoRules: [
            v => !!v || 'Monto is required',
            v => (!isNaN(v) ) || 'Monto debe ser numero',
        ],
        fecha: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        user: window.User,
        data_compras:[]
    }),
  mounted() {
        //this.get_compras();
        //chart.data = this.data_compras;

        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
        chart.paddingRight = 20;

        chart.dataSource.url = '/api/compra/'+this.user.id;
        
        
        
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "fecha";
        series.dataFields.valueY = "monto";
        series.fillOpacity = 0.8;
        series.visible=true;


        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        this.chart = chart;
  },
  /*watch: {
    data_compras(newValue, oldValue) {
      if (this.chart) {
        this.chart.data = this.data_compras;
      }
    }
  },*/
  methods: {
    async get_compras(){
        await this.axios.get('/api/compra/'+this.user.id)
                .then(response => {
                    this.data_compras = response.data;
                    
                }).catch(error =>{
                    this.data_compras = []
                })
    },
    async agregar(){
        if(!this.$refs.form.validate()){
            alert("Campos Incorrectos");
            return;
        }
        //error, deberia generar automatico el objeto...
        //error de seguridad, el usuario deberia entregarse automatica con la autorizacion...
        //eliminar las alertas
        await this.axios.post('/api/compra/',{
                    user_id: this.user.id,
                    fecha: this.fecha,
                    monto: this.monto,
            })
            .then(response=>{ 
                this.$refs.form.reset();
                alert("monto agregado");
                //this.get_compras()
                this.chart.dataSource.load();
            })
            .catch(error => {
                alert("error enviando el dato");
                console.log(error);
            })
    }

  }
}
</script>
<style scoped>
    .chart-monto-diario {
    width: 100%;
    height: 500px;
    }
</style>