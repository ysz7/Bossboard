import { User } from '../entities/user.entity';                                                                                                                                                                                                                                               

export interface IAuthRepository {                                                                                                            
  findByEmail(email: string): Promise<User | null>;       
  create(email: string, hashedPassword: string): Promise<User>;
}   

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';