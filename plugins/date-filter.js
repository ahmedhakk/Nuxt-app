import Vue from 'vue'

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const dateFilter = value => {
    return formatDate(value);
};

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const formattedDate = day + ". " + months[month] + " " + year;
    return formattedDate;
}

Vue.filter('date', dateFilter); // Vue.filter(event, function())
// in any page use the filter with its name will be excuted

// like in posts/_id/index.vue
// { { message | filterA | filterB } }
// Last Updated on {{ loadedPost.updatedDate | date }}
