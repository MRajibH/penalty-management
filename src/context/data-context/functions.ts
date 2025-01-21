import {
  CollectionReference,
  DocumentData,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";

export const getSnapshotData = (
  snapshot: QuerySnapshot<DocumentData, DocumentData>
) => {
  const data: any = [];
  snapshot.forEach((doc) => {
    data.push({ ...doc.data(), id: doc.id });
  });
  return data;
};

export const getQueryRef = (
  ref: CollectionReference<DocumentData, DocumentData>
) => {
  return query(ref, orderBy("createdAt", "desc"));
};

export const mappedFunc = (previous: any, current: any) => {
  const { id, createdAt, modifiedAt, ...rest } = current;
  previous[id] = rest;
  return previous;
};
