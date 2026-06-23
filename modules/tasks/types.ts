export type Task = {
  id: string;
  title: string;
  startTime: Date | null;
  endTime: Date | null;
  done: boolean;
}
