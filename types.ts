interface StateNode {
  type: string;
  attributes: {
    bold?: boolean;
    [key: string]: any;
  };
  next?: StateNode;
}

interface Selection {
  start: StateNode;
  end: StateNode;
} 