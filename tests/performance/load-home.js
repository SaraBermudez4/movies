import { sleep } from "k6"
import http from "k6/http"

export const options = { stages: [{ duration: "30s", target: 20 }] }

export default function () {
  http.get("http://localhost:3000/")
  sleep(1)
}
