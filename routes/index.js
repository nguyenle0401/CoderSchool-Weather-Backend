var express = require("express");
var router = express.Router();
var axios = require("axios");

/* GET home page. */

async function getCoordinates(city) {
  try {
    // const token = process.env.MAP_TOKEN;
    const token =
      "pk.eyJ1IjoiY2hsb2VsZS0xMyIsImEiOiJja2RzYjBzdnkxbm55MnlxcWFnajByNDdtIn0.Oh5WPkxb6z7UaliyBJk1Kw";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      city
    )}.json?access_token=${token}`;
    console.log(url);
    const res = await axios.get(url);

    // console.log(res.data);
    if (res.data.features.length !== 0) {
      return res.data.features[0];
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function getWeather([lng, lat]) {
  try {
    // const open_weather_key = process.env.OPEN_WEATHER_KEY;
    const open_weather_key = "e2389e4170f2b46eaa63346a65135091";
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${open_weather_key}&units=metric`;
    const { data } = await axios.get(
      url
    );
    return data;
  } catch (err) {
    return null;
  }
}

router.get("/", async function (req, res, next) {
  try {
    console.log("ahihi");
    const { city } = req.query;
    if (!city) {
      return res
        .status(400)
        .json({ message: "User need to provide city query" });
    }

    // use city to get geo coordinates
    const place = await getCoordinates(city);
    if (!place) {
      return res.status(400).json({ message: "Cannot find your place" });
    }

    // use geo coordinates to get weather info
    const result = await getWeather(place.geometry.coordinates);
    if (!result) {
      return res
        .status(400)
        .json({ message: "Cannot get weather for your place" });
    }
    result["place"] = place.place_name;

    res.json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
