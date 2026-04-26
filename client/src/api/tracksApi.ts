import { fetchJson } from "./config";
import type { ApiListResponse, TrackDto } from "../types/api";

const prefix = "/api/v1";

export function fetchTracks() {
  return fetchJson<ApiListResponse<TrackDto[]>>(`${prefix}/tracks`);
}

export function fetchTrackById(id: string) {
  return fetchJson<ApiListResponse<TrackDto>>(`${prefix}/tracks/${encodeURIComponent(id)}`);
}
