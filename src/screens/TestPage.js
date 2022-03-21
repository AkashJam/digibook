import React, { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { SwipeListView } from "react-native-swipe-list-view";

const rowTranslateAnimatedValues = {}; //Contains task animation values
const items = {}; //Contain rowMap for closing task swipe

export default function TestPage() {
  const [listData, setListData] = useState([
    { key: "1", text: "item #1", line: false },
  ]);
  let list = [];
  listData.forEach((x) => {
    list.push(x["key"]);
  });
  setAnimationValues(list);

  function setAnimationValues(keys) {
    keys.forEach((x) => {
      rowTranslateAnimatedValues[`${x}`] = new Animated.Value(1);
    });
  }

  const [touch, SetTouch] = useState(false);
  const delay = (gesture, ms) =>
    new Promise((res) =>
      gesture ? (touch ? delay(false, 200) : res) : setTimeout(res, ms)
    );

  function addItem() {
    let id = Math.random() * 10000;
    const newData = [
      ...listData,
      { key: `${id}`, text: `item #${id}`, line: false },
    ];
    setListData(newData);
    setAnimationValues([`${id}`]);
  }

  const animationIsRunning = useRef(false);

  function onSwipeValueChange(swipeData) {
    const { key, value } = swipeData;
    if (
      value < -Dimensions.get("window").width / 1.3 &&
      !animationIsRunning.current
    ) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start(async () => {
        await delay(false, 250);
        items[`${key}`].resetView();
        await delay(false, 400);
        const newData = [...listData];
        const prevIndex = listData.findIndex((item) => item.key === key);
        newData.splice(prevIndex, 1);
        setListData(newData);
        animationIsRunning.current = false;
      });
    } else if (
      value > Dimensions.get("window").width / 2 &&
      !animationIsRunning.current
    ) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        useNativeDriver: false,
      }).start(() => {
        let itemup = listData.filter((item) => item.key === key)[0];
        itemup.line = !itemup.line;
        setListData((prev) =>
          prev.map((item) => (item.key === key ? itemup : item))
        );
        items[`${key}`].resetView();
        animationIsRunning.current = false;
      });
    }
  }

  function renderItem(data, rowMap) {
    return {
      resetView: function () {
        rowMap[data.item.key].closeRow();
      },
      itemRender: function () {
        return (
          <Animated.View>
            <TouchableHighlight
              onPress={() => console.log("You touched me")}
              style={styles.rowFront}
              underlayColor={"#AAA"}
            >
              <View>
                <Text
                  style={{
                    textDecorationLine: data.item.line
                      ? "line-through"
                      : "none",
                  }}
                >
                  I am {data.item.text} in a SwipeListView
                </Text>
              </View>
            </TouchableHighlight>
          </Animated.View>
        );
      },
    };
  }

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        data={listData}
        renderItem={(data, rowMap) => {
          items[`${data.item.key}`] = renderItem(data, rowMap);
          return items[`${data.item.key}`].itemRender();
        }}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={Dimensions.get("window").width / 2}
        rightOpenValue={-Dimensions.get("window").width / 2}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
      />
      <TouchableOpacity
        style={{ position: "absolute", right: 25, bottom: 25 }}
        onPress={() => addItem()}
      >
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: 50,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    alignItems: "center",
    backgroundColor: "#CCC",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
});
