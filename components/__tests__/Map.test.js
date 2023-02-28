import React from "react"
import { render, waitFor } from "@testing-library/react-native"
import Map from "../Map"
// Import check from react-native-permissions
import { check } from "react-native-permissions"
// Import Geolocation also
import Geolocation from "react-native-geolocation-service"

describe("<Map />", () => {
  test("should renders MapView and Marker with user current location", async () => {
    const { getByTestId } = render(<Map />) 

    await waitFor(() => {
      expect(check).toHaveBeenCalledTimes(1)
      expect(Geolocation.getCurrentPosition).toHaveBeenCalledTimes(1)
      expect(getByTestId("map")).toBeDefined()
    })
  })
})