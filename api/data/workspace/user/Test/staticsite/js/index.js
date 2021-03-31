var port = 8080;
var url = "http://localhost:" + port + "/";

// Is executed when page is successfully loaded
window.onload = getAllUsers;

/**
 * Does a GET request to the given url and
 * processes the response
 */
function getAllUsers() {
    fetch(url + "users").then(function (response) {
        return response.json();
    }).then(function (json) {
        showUsers(json);
    });
}

/**
 * Sends a POST Request to the specified url
 * containing details needed for creating a new user
 */
function createUser() {
    var name = document.getElementById('name_field').value;
    var email = document.getElementById('email_field').value;
    var phone = document.getElementById('phone_field').value;
    var age = document.getElementById('age_field').value;

    fetch(url + "createUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "email": email,
            "phone": phone,
            "age": age
        })
    }).then(function (response) {
        if (response.ok) {
            getAllUsers();
        } else {
            alert("User already exist");
        }
    })
}

/**
 * Sends a POST Request to the given url with
 * the email of the specific user that is to
 * be deleted
 *
 * @param email email of the user to delete
 */
function deleteUser(email) {
    fetch(url + "deleteUser?email=" + email, {
        method: "DELETE"
    }).then(function (response) {
        if (response.ok) {
            getAllUsers();
        } else {
            alert("User could not be found");
        }
    });
}

/**
 * Iterates over all the objects given in
 * the JSON Object and adds them to the table_body.
 *
 * @param json json object containing the response from the server
 */
function showUsers(json) {
    var table_body = '';
    json.forEach(function (object) {
        table_body += formatUserRow(object);
    });
    document.getElementById('table_body').innerHTML = table_body;
}

/**
 * Returns an html table row containing user details
 *
 * @param user the user you wish to make a row of
 * @returns an html table row containing user details
 */
function formatUserRow(user) {
    return (
        "<tr>\n" +
        "   <td>" + user['name'] + "</td>\n" +
        "   <td>" + user['email'] + "</td>\n" +
        "   <td>" + user['phone'] + "</td>\n" +
        "   <td>" + user['age'] + "</td>\n" +
        "   <td><button onclick=deleteUser(\"" + user['email'] + "\") type=\"button\" class=\"nes-btn is-error\">Delete</button></td>\n" +
        "</tr>"
    );
}