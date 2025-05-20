import { Models } from 'appwrite';
import { User, NutritionistProfile, ChatMessage } from './chat';

export type AppwriteDocument = Models.Document;

export interface UserDocument extends AppwriteDocument, User {}
export interface NutritionistDocument extends AppwriteDocument, NutritionistProfile {}
export interface ChatMessageDocument extends AppwriteDocument, ChatMessage {}
