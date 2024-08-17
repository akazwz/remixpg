import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  Form,
  useLoaderData,
  useNavigation,
  Link,
} from "@remix-run/react";
import { eq, not } from "drizzle-orm";
import { Trash2Icon, PlusIcon, ListTodoIcon } from "lucide-react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { drizzleDB } from "~/db.client";
import * as schema from "~/schema";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { completeSound } from "~/audio.client";

export async function clientLoader({}: ClientLoaderFunctionArgs) {
  return {
    todos: await drizzleDB.query.todos.findMany({
      orderBy: schema.todos.done,
    }),
  };
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData();
  switch (request.method) {
    case "POST":
      const todo = formData.get("todo") as string;
      await drizzleDB.insert(schema.todos).values({
        id: crypto.randomUUID(),
        name: todo,
        done: false,
      });
      break;
    case "PUT":
      
      const result = await drizzleDB
        .update(schema.todos)
        .set({ done: not(schema.todos.done) })
        .where(eq(schema.todos.id, formData.get("id") as string))
        .returning({
          done: schema.todos.done,
        });
      if (result[0].done) {
        completeSound.play();
      }
      break;
    case "DELETE":
      await drizzleDB
        .delete(schema.todos)
        .where(eq(schema.todos.id, formData.get("id") as string));
      break;
  }
  return null;
}

export default function Index() {
  const { todos } = useLoaderData<typeof clientLoader>();
  const newFormRef = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      newFormRef.current?.reset();
    }
  }, [navigation.state]);

  return (
    <div className="h-dvh flex flex-col">
      <header className="p-4 flex items-center max-w-4xl w-full mx-auto">
        <Link to="/">
          <ListTodoIcon className="size-7" />
        </Link>
        <div className="flex-1" />
        <Link to="https://github.com/akazwz/remixpg" target="_blank">
          <GitHubLogoIcon className="size-6" />
        </Link>
      </header>
      <div className="flex gap-4 w-full items-center h-full flex-1 overflow-y-auto justify-center flex-col p-4 max-w-xl mx-auto">
        <Form ref={newFormRef} method="POST" className="flex gap-2 w-full">
          <Input required name="todo" />
          <Button
            disabled={
              navigation.state === "submitting" &&
              navigation.formMethod === "POST"
            }
          >
            <PlusIcon className="size-6" />
          </Button>
        </Form>
        <div className="p-4 flex gap-4 flex-col w-full flex-1 overflow-y-auto">
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className="border p-2 rounded-md h-fit flex items-center"
            >
              <Form method="PUT" className="flex px-1">
                <input hidden name="id" defaultValue={todo.id} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                >
                  {todo.done ? (
                    <CheckCircleIconSolid className="text-blue-500" />
                  ) : (
                    <CheckCircleIcon />
                  )}
                </Button>
              </Form>
              <span
                className={cn({
                  "line-through text-muted-foreground": todo.done,
                })}
              >
                {todo.name}
              </span>
              <div className="flex-1" />
              <Form method="DELETE" className="p-2">
                <input hidden name="id" defaultValue={todo.id} />
                <Button size="icon" variant="ghost">
                  <Trash2Icon className=" text-destructive" />
                </Button>
              </Form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
