export interface ActivityHistory {
    _id: string;
    activityId: {
      _id: string;
      name: string;
    };
    userId: {
      _id: string;
      username: string;
    };
    changeType: 'create' | 'update' | 'delete';
    changedFields?: string[];
    previousValues?: any;
    newValues?: any;
    timestamp: Date;
  }