let date = new Date();

let day = (date.getDate()).toString();
let month = (date.getMonth() + 1).toString();
let year = date.getFullYear();

let today = year + '-' + "00".substring(month.length) + month + '-' + "00".substring(day.length) + day;
const dateInput2 = document.getElementById('date-input') as HTMLInputElement;
if (dateInput2) {
    dateInput2.value = today;
}
