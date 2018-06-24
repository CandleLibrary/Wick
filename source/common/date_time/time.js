function float24to12ModTime(time, CAPITAL) {
    var IS_PM = time >= 12 && time < 24;
    var minutes = ((time % 1) * 60) | 0;
    var hours = (((time | 0) % 12) != 0) ? (time | 0) % 12 : 12;

    return (hours + ":" + ("0" + minutes).slice(-2)) + ((IS_PM) ? (CAPITAL) ? "PM" :"pm" : (CAPITAL) ? "AM" : "am");
}

export {float24to12ModTime}