import { FileAccess } from "../dataLayer/fileAccess";
import { ItemAccess } from "../dataLayer/ItemAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

export class todoLogic {

    constructor(){
    }

    /**
     * Create an item
     * @param newTodo 
     * @param userId 
     * @returns 
     */
    async createTodo(newTodo: CreateTodoRequest, userId: string):Promise<TodoItem> {
        return await new ItemAccess().createItem(newTodo, userId);
    }

    /**
     * 
     * @param userId 
     * @param todoId 
     * @returns 
     */
    async deleteTodo(userId: string, todoId: string):Promise<boolean> {
        return await new ItemAccess().DeleteItem(userId, todoId);
    }

    /**
     * 
     * @param userId 
     * @param todoId 
     * @returns 
     */
    async getUploadUrl(userId: string, todoId: string):Promise<string> {

        //look for the item
        const item = await new ItemAccess().GetItem(todoId, userId);
        if(!item.Item){ return ""}

        //Return the pre-signed URL for upload
        return await new FileAccess().getUploadUrl(userId, todoId)
    }

    /**
     * 
     * @param userId 
     * @returns 
     */
    async getTodos(userId:string):Promise<TodoItem[]>
    {
        //Get TODO items
        const todos = await new ItemAccess().GetItems(userId);

        //Get the pre-signed URL for each item and convert it to a todo item
        todos.Items.map(x =>{ 
            if(x.attachmentUrl !== ""){
              x.attachmentUrl = new FileAccess().getGetUrl(x.userId, x.attachmentUrl);
            }})

         return todos.Items as TodoItem[];
    }

    /**
     * 
     * @param userId 
     * @param todoId 
     * @param updatedTodo 
     * @returns 
     */
    async updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
        return await new ItemAccess().UdateItem(userId, todoId, updatedTodo);
      }

}

