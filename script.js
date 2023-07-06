const app = Vue.createApp({
  chart: {},
  data() {
    return {
      weightLists: [],
    };
  },
  methods: {
    confirm() {
      const [ID, Weight, Date] = [
        crypto.randomUUID(),
        parseInt(this.$refs.inputWeightDom.value),
        this.$refs.inputDateDom.value,
      ];
      if (Weight && Date) {
        this.weightLists.push({ ID, Weight, Date });
      }
      [this.$refs.inputWeightDom.value, this.$refs.inputDateDom.value] = [
        null,
        null,
      ];
    },
    sortWeightLists() {
      this.weightLists.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    },
    remove(index) {
      this.weightLists.splice(index, 1);
    },
    autoSave() {
      if (this.weightLists.length > 0) {
        const saveData = JSON.stringify(this.weightLists);
        localStorage.setItem("weightListsSaveData", saveData);
      } else {
        localStorage.removeItem("weightListsSaveData");
      }
    },
    autoLoad() {
      const saveData = localStorage.getItem("weightListsSaveData");
      if (saveData) {
        this.weightLists = JSON.parse(saveData);
      }
    },
    loadChart() {
      const ctx = this.$refs.lineChart;
      const data = {
        labels: [],
        datasets: [
          {
            label: "weight",
            data: [],
            borderWidth: 1,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };
      const config = {
        type: "line",
        data,
      };
      this.chart = new Chart(ctx, config);
    },
    updateChart() {
      this.chart.data.datasets[0].data = this.weightLists.map(
        (list) => list.Weight
      );
      this.chart.data.labels = this.weightLists.map((list) => list.Date);

      // Update the chart
      this.chart.update();
    },
  },
  mounted() {
    this.autoLoad();
    this.loadChart();
  },
  watch: {
    weightLists: {
      deep: true,
      handler() {
        this.sortWeightLists();
        this.autoSave();
        this.updateChart();
      },
    },
  },
});
app.mount("#app");
