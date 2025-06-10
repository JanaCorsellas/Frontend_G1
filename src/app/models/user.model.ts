export interface User {
  _id: string;
  username: string;
  bio: string;
  profilePicture: string;
  level: number;
  email: string;
  activities?: any[];
  visible?: boolean;
  visibility?: boolean;
  role: string;
  
  // ============ NUEVAS PROPIEDADES PARA GESTIÓN DE SEGUIMIENTO ============
  followers?: string[]; // Array de IDs de usuarios que siguen a este usuario
  following?: string[]; // Array de IDs de usuarios que este usuario sigue
  followersCount?: number; // Contador de seguidores
  followingCount?: number; // Contador de usuarios que sigue
  
  // Propiedades adicionales para estadísticas
  totalDistance?: number;
  totalTime?: number;
  achievements?: string[];
  challengesCompleted?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  refreshToken?: string;
}

export class User implements User {
  constructor(
    public _id: string,
    public username: string,
    public bio: string,
    public profilePicture: string,
    public level: number,
    public email: string,
    public activities?: any[],
    public visible?: boolean,
    public visibility?: boolean,
    public role: string = 'user', // Rol per defecte 'user'
    public followers?: string[],
    public following?: string[],
    public followersCount?: number,
    public followingCount?: number,
    public totalDistance?: number,
    public totalTime?: number,
    public achievements?: string[],
    public challengesCompleted?: string[],
    public createdAt?: Date,
    public updatedAt?: Date,
    public googleId?: string,
    public refreshToken?: string
  ) {
    // Inicializar arrays vacíos si no se proporcionan
    this.followers = this.followers || [];
    this.following = this.following || [];
    this.activities = this.activities || [];
    this.achievements = this.achievements || [];
    this.challengesCompleted = this.challengesCompleted || [];
    
    // Calcular contadores si no se proporcionan
    this.followersCount = this.followersCount ?? this.followers.length;
    this.followingCount = this.followingCount ?? this.following.length;
  }

  // ============ MÉTODOS ÚTILES PARA GESTIÓN DE SEGUIMIENTO ============
  
  /**
   * Verificar si este usuario sigue a otro usuario
   */
  isFollowing(userId: string): boolean {
    return this.following ? this.following.includes(userId) : false;
  }

  /**
   * Verificar si este usuario es seguido por otro usuario
   */
  isFollowedBy(userId: string): boolean {
    return this.followers ? this.followers.includes(userId) : false;
  }

  /**
   * Obtener estadísticas básicas de seguimiento
   */
  getFollowStats() {
    return {
      followersCount: this.followersCount || 0,
      followingCount: this.followingCount || 0,
      followers: this.followers || [],
      following: this.following || []
    };
  }

  /**
   * Agregar un seguidor
   */
  addFollower(userId: string): void {
    if (!this.followers) this.followers = [];
    if (!this.followers.includes(userId)) {
      this.followers.push(userId);
      this.followersCount = this.followers.length;
    }
  }

  /**
   * Remover un seguidor
   */
  removeFollower(userId: string): void {
    if (!this.followers) return;
    const index = this.followers.indexOf(userId);
    if (index > -1) {
      this.followers.splice(index, 1);
      this.followersCount = this.followers.length;
    }
  }

  /**
   * Seguir a un usuario
   */
  followUser(userId: string): void {
    if (!this.following) this.following = [];
    if (!this.following.includes(userId)) {
      this.following.push(userId);
      this.followingCount = this.following.length;
    }
  }

  /**
   * Dejar de seguir a un usuario
   */
  unfollowUser(userId: string): void {
    if (!this.following) return;
    const index = this.following.indexOf(userId);
    if (index > -1) {
      this.following.splice(index, 1);
      this.followingCount = this.following.length;
    }
  }

  /**
   * Obtener perfil público (sin información sensible)
   */
  getPublicProfile() {
    return {
      _id: this._id,
      username: this.username,
      bio: this.bio,
      profilePicture: this.profilePicture,
      level: this.level,
      followersCount: this.followersCount || 0,
      followingCount: this.followingCount || 0,
      totalDistance: this.totalDistance || 0,
      totalTime: this.totalTime || 0,
      createdAt: this.createdAt
    };
  }
}