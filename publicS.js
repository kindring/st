module.exports = {
    main: null,
    setMainWindow(main) {
        // console.log(main);
        this.main = main;
    },
    getMainwindow() {
        return this.main;
    }
}