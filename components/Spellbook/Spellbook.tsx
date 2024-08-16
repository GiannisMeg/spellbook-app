"use client";
// we render this component in the main page so we dont need test code there
import { trpc } from "@/server/client";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
//import store
import useSpellbookStore from "@/store/spellbookStore";

export default function Spellbook() {
	const spellbooks = trpc.spellbooks.get.useQuery();
	//call mutation
	const addSpellbook = trpc.spellbooks.create.useMutation();

	// replaced by zustand
	// const [title, setTitle] = useState<string>("");
	// const [description, setDescription] = useState<string>("");

	// Get state and actions from the Zustand store
	const { title, description, setTitle, setDescription, resetFields } =
		useSpellbookStore();

	// create function after we created mutation and call it
	const addNewSpellbook = () => {
		addSpellbook.mutate({
			title,
			description,
		});

		//// Reset fields after adding a spellbook
		// setTitle("");
		// setDescription("");
		////using zustand state
		resetFields();
	};

	return (
		<div className="grid grid-cols-4 gap-5">
			{/* map through spellbooks and provide a unique id for each card */}
			{spellbooks.data?.map((spellbook) => (
				//Link card with added spells
				<Link key={spellbook.id} href={`/spellbook/${spellbook.id}`}>
					<Card style={{ backgroundColor: "#e6e6ff" }}>
						<CardHeader>
							<CardTitle>{spellbook.title}</CardTitle>
							<CardDescription>{spellbook.description}</CardDescription>
						</CardHeader>
						{/* display spell uploaded image */}
						<CardContent>
							{spellbook.spells.map((spell) => (
								<Image
									key={spell.id}
									src={spell.image ?? ""}
									width={30}
									height={30}
									alt={spell.title}
								/>
							))}
						</CardContent>
					</Card>
				</Link>
			))}
			<Dialog>
				{/* asChild to get the right format */}
				<DialogTrigger asChild>
					<Card
						style={{ backgroundColor: "#e6e6ff" }}
						className="flex justify-center items-center cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-10 h-10 text-gray-400"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4.5v15m7.5-7.5h-15"
							/>
						</svg>
					</Card>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create your spellbook</DialogTitle>
						<DialogDescription>Create your spells.</DialogDescription>
						<div className="flex flex-col gap-3">
							<p>Title:</p>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<p>Description:</p>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<Button onClick={addNewSpellbook}>Save</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}
