export interface Board {
  id: number;
  title: string;
  description: string;
  status:string;
  owner: { username: string; id: number };
  users: { username: string; id: number }[];
}
