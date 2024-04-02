import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Select, Stack, Text, Heading, IconButton, Flex, Tag, Spacer } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      type,
      amount: parseFloat(amount),
      date,
      tags: tags.split(",").map((tag) => tag.trim()),
    };
    setTransactions([...transactions, newTransaction]);
    setType("expense");
    setAmount("");
    setDate("");
    setTags("");
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
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
