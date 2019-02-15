"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var saveDreamToDatabase = (date, dream) => __awaiter(this, void 0, void 0, function* () {
    try {
        const url = window.location.href + `api/v1/dreams`;
        const response = yield fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: date,
                dream: dream
            })
        });
        const newDream = yield response.json();
        return yield newDream;
    }
    catch (error) {
        console.log(error);
    }
});
var getUserDreams = (userId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const url = window.location.href + `api/v1/users/${userId}/user_id`;
        const response = yield fetch(url);
        const data = yield response.json();
        makeWordCloud(data);
        displayDreams(data);
    }
    catch (error) {
        console.log(error);
    }
});
var googleAuthenticate = (id_token) => __awaiter(this, void 0, void 0, function* () {
    var xhr = yield new XMLHttpRequest();
    const authUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`;
    xhr.open('POST', authUrl);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('idtoken=' + id_token);
    xhr.onload = yield function () {
        return __awaiter(this, void 0, void 0, function* () {
            let authorized = yield authorizeUser(id_token);
            return authorized;
        });
    };
});
var authorizeUser = (token) => __awaiter(this, void 0, void 0, function* () {
    try {
        const url = window.location.href + `api/v1/users/authorize`;
        const response = yield fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token
            })
        });
        const userId = yield response.json();
        getUserDreams(userId[0].user_id);
        setCurrentUser(userId[0].user_id);
        return yield userId[0].user_id;
    }
    catch (error) {
        console.log(error);
    }
});
var makeWordCloud = (dreams) => {
    const filteredWords = dreamCounter(dreams);
    let cloudData = {
        type: 'wordcloud',
        options: {
            words: filteredWords
        }
    };
    $(document).ready(function () {
        zingchart.render({
            id: 'myChart',
            data: cloudData,
            height: 200,
            width: '100%'
        });
    });
};
var setCurrentUser = (userId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const url = window.location.href + `api/v1/users/${userId}`;
        const response = yield fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentUser: true
            })
        });
        return yield response.json();
    }
    catch (error) {
        console.log(error);
    }
});
var logoutUser = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const url = window.location.href + `api/v1/users`;
        const response = yield fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentUser: false
            })
        });
        return yield response.json();
    }
    catch (error) {
        console.log(error);
    }
});
var deleteDreamFromDatabase = (dreamId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const url = window.location.href + `api/v1/dreams/${dreamId}`;
        const response = yield fetch(url, {
            method: 'DELETE'
        });
        return yield response.json();
    }
    catch (error) {
        console.log(error);
    }
});
