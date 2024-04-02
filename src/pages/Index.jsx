import React, { useState, useEffect } from "react";

const SUPABASE_URL = "https://qlspolxlciqisguikadj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsc3BvbHhsY2lxaXNndWlrYWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwNjIzNjUsImV4cCI6MjAyNzYzODM2NX0.irSWPOb6FeYmyF1U7suMoB4yQgWjKHxMAAU4VsmEBsU";
import { Box, Button, FormControl, FormLabel, Input, Select, Stack, Text, Heading, IconButton, Flex, Tag, Spacer } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const data = await response.json();
    setTransactions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${SUPABASE_URL}/rest/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        type,
        amount: parseFloat(amount),
        date,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
      }),
    });
    if (response.ok) {
      fetchTransactions();
    }
    setType("expense");
    setAmount("");
    setDate("");
    setTags("");
  };

  const handleDelete = async (id) => {
    await fetch(`${SUPABASE_URL}/rest/v1/transactions?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    fetchTransactions();
  };

  const totalSum = transactions.reduce((sum, transaction) => (transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount), 0);

  return (
    <Box maxWidth="500px" margin="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Budget Tracker
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
            Add Transaction
          </Button>
        </Stack>
      </form>
      <Box mt={8}>
        <Heading as="h2" size="lg" mb={4}>
          Transactions
        </Heading>
        {transactions.map((transaction) => (
          <Flex key={transaction.id} alignItems="center" p={2} borderBottom="1px" borderColor="gray.200">
            <Text>{transaction.date}</Text>
            <Spacer />
            <Text color={transaction.type === "income" ? "green.500" : "red.500"}>
              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </Text>
            <Spacer />
            {transaction.tags.map((tag) => (
              <Tag key={tag} size="sm" colorScheme="blue" mr={2}>
                {tag}
              </Tag>
            ))}
            <IconButton icon={<FaTrash />} size="sm" onClick={() => handleDelete(transaction.id)} />
          </Flex>
        ))}
      </Box>
      <Box mt={8}>
        <Heading as="h2" size="lg">
          Total Sum: ${totalSum.toFixed(2)}
        </Heading>
      </Box>
    </Box>
  );
};

export default Index;
