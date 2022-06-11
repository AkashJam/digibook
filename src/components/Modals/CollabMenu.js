import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { COLORS, FONTS, SIZES } from "../../constants";
import { API, toastr } from "../../globalvars";

export default function CollabMenu(props) {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState(props.users);

  if (users !== props.users) setUsers(props.users);

  const addUser = async () => {
    if (username !== "" && username.length > 2) {
      data = await API.addUserGroup({
        id: props.id,
        user: { username: username },
      });
      if (data.code === 200) {
        const newUsers = users;
        newUsers.push({ username: username, owner: false });
        props.setUsers(newUsers);
        setUsers(newUsers);
        setUsername("");
      } else toastr(data.status);
      console.log("user added successfully");
    } else toastr("Invalid username");
  };

  const removeUser = (username) => {
    Alert.alert(
      "Remove user",
      "Are you sure you want to remove user from the group",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            data = await API.updateUserGroup({
              id: props.id,
              user: { username: username },
              group: { active: false },
            });
            if (data.code == 200) {
              // dispatch({ type: "delete_group", id: value });
              const newUsers = users.map((user) => {
                if (user.owner) return { ...user, owner: false };
                else if (user.username === username)
                  return { ...user, owner: true };
                else return user;
              });
              props.setUsers(newUsers);
              setUsers(newUsers);
            } else toastr(data.status);
          },
        },
      ]
    );
  };

  const editUser = async (username) => {
    Alert.alert(
      "Upgrade user",
      "Are you sure you want to make user owner of the group",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const userdata = users.filter((user) => user.owner);
            data = await API.updateUserGroup({
              id: props.id,
              user: { username: userdata[0].username },
              group: { owner: false, maintainer: true },
            });
            data = await API.updateUserGroup({
              id: props.id,
              user: { username: username },
              group: { owner: true, maintainer: false },
            });
            if (data.code == 200) {
              // dispatch({ type: "delete_group", id: value });
              const newUsers = props.users.filter(
                (user) => user.username !== username
              );
              props.setUsers(newUsers);
              setUsers(newUsers);
            } else toastr(data.status);
          },
        },
      ]
    );
  };

  const userTypes = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (props.owner && !item.owner) removeUser(item.username);
          }}
        >
          <Text
            style={{
              ...FONTS.h2_bold,
              color: COLORS.accent,
              padding: SIZES.margin,
            }}
          >
            {item.username}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (props.owner && !item.owner) editUser(item.username);
          }}
        >
          <Text
            style={{
              ...FONTS.p_regular,
              color: COLORS.primary,
              padding: SIZES.margin,
            }}
          >
            {item.owner ? "owner" : "maintainer"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      style={{
        height: Dimensions.get("window").height,
      }}
      visible={props.active}
      onRequestClose={() => props.close()}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.5)",
          height: "100%",
          width: "100%",
          zIndex: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => props.close()}
      >
        <TouchableWithoutFeedback>
          <View
            style={{
              borderRadius: SIZES.borderRadius,
              backgroundColor: COLORS.secondary,
              padding: SIZES.padding,
              width: "70%",
              // minHeight: "25%",
              // maxHeight: "60%",
            }}
          >
            <Text
              style={{
                ...FONTS.h1_bold,
                color: COLORS.accent,
                padding: SIZES.padding,
              }}
            >
              Collaborators
            </Text>
            {props.owner && (
              <View
                style={{
                  marginVertical: SIZES.padding,
                  color: COLORS.secondary,
                  backgroundColor: COLORS.accent,
                  borderRadius: SIZES.borderRadius,
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    alignItems: "center",
                    paddingVertical: 8,
                    paddingHorizontal: "6%",
                  }}
                  onPress={addUser}
                >
                  <Text style={{ ...FONTS.h1_bold, color: COLORS.accent }}>
                    +
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder="Enter username"
                  style={{
                    ...FONTS.p_regular,
                    fontSize: 16,
                    color: COLORS.secondary,
                    flex: 1,
                    // marginVertical: SIZES.margin,
                    marginHorizontal: "6%",
                  }}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                />
              </View>
            )}
            <View
              style={{
                borderRadius: SIZES.borderRadius,
                borderColor: COLORS.accent,
                borderWidth: 1,
                marginVertical: SIZES.padding,
                padding: SIZES.margin,
                height:
                  users.length === 1 ? 48 * users.length : 43 * users.length,
              }}
            >
              <FlatList
                data={users}
                renderItem={userTypes}
                keyExtractor={(item) => `${item.username}`}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}
