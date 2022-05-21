const path = "http://10.0.2.2:3000";

const API = {
  // user
  login: async (user) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },
  register: async (user) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },
  updateUser: async (userdata) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdata),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },

  // groups
  getGroups: async (userID) => {
    //GET request
    const response = await fetch(`${path}/group/${userID}`, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        return error;
      });
    return response;
  },
  createGroup: async (groupdata) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/group/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupdata),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },
  updateGroup: async (groupdata) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/group/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupdata),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },

  // Tasks
  getTasks: async (userID) => {
    //GET request
    const response = await fetch(`${path}/task/${userID}`, {
      method: "GET",
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        return error;
      });
    return response;
  },
  createTask: async (taskdata) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/task/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskdata),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },
  updateTask: async (taskdata) => {
    //POST json
    //making data to send on server
    // const data = { username: username, password: password };
    //POST request
    const response = await fetch(`${path}/task/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskdata),
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        return responseJson;
      })
      //If response is not in json then in error
      .catch((error) => {
        return error;
      });
    return response;
  },
};

export default API;
