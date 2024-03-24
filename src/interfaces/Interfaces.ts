interface MessageInterface {
    message: string;
    type: "AI" | "human";
    citation?: CitationInterface[];
    message_sequence: number;
}

interface CitationInterface {
    page_content: string;
    metadata: Record<string, unknown>;
}

interface SessonInterface {
    id: string;
    name: string;
}



export type { MessageInterface, CitationInterface , SessonInterface}