# Adding TestIDs to Cashlog Components

This guide shows you how to add the required `testID` attributes to enable E2E testing with Detox.

## Required Changes

### 1. App.tsx

Add testIDs to main app elements:

```tsx
/* In the header View */
<View style={styles.header}>
  <Text 
    testID="app-title"
    style={[styles.title, {color: getColor(Colors.text.primary, isDarkMode)}]}
  >
    Cashlog
  </Text>
</View>

/* In the FlatList */
<FlatList
  testID="transaction-list"
  data={expenses}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  ListHeaderComponent={listHeaderComponent}
  contentContainerStyle={contentContainerStyle}
  showsVerticalScrollIndicator={false}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
  updateCellsBatchingPeriod={50}
/>
```

### 2. BalanceCard.tsx

Add testIDs to balance card elements:

```tsx
<View 
  testID="balance-card"
  style={cardStyle}
>
  {/* Total Balance */}
  <Text 
    testID="balance-amount"
    style={[styles.balanceAmount, balanceColorStyle]}
  >
    {formatCurrency(totalBalance)}
  </Text>

  {/* Income */}
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>Income</Text>
    <Text 
      testID="income-amount"
      style={[styles.statValue, {color: Colors.income}]}
    >
      {formatCurrency(totalIncome)}
    </Text>
  </View>

  {/* Expense */}
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>Expense</Text>
    <Text 
      testID="expense-amount"
      style={[styles.statValue, {color: Colors.expense}]}
    >
      {formatCurrency(totalExpense)}
    </Text>
  </View>
</View>
```

### 3. ExpenseForm.tsx

Add testIDs to form elements:

```tsx
<View 
  testID="expense-form"
  style={cardStyle}
>
  {/* Toggle buttons */}
  <View style={styles.toggleRow}>
    <TouchableOpacity 
      testID="toggle-expense"
      style={expenseToggleStyle} 
      onPress={handleSetExpense}
    >
      <Text style={expenseTextStyle}>Expense</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      testID="toggle-income"
      style={incomeToggleStyle} 
      onPress={handleSetIncome}
    >
      <Text style={incomeTextStyle}>Income</Text>
    </TouchableOpacity>
  </View>

  {/* Description input */}
  <View style={styles.inputContainer}>
    <TextInput
      testID="input-description"
      style={inputStyle}
      value={description}
      placeholder="What is this for?"
      placeholderTextColor={placeholderColor}
      selectionColor={selectionColor}
      onChangeText={setDescription}
    />
  </View>

  {/* Amount input */}
  <View style={styles.inputContainer}>
    <TextInput
      testID="input-amount"
      style={inputStyle}
      value={amount}
      placeholder="0.00"
      placeholderTextColor={placeholderColor}
      selectionColor={selectionColor}
      keyboardType="numeric"
      onChangeText={setAmount}
    />
  </View>

  {/* Submit button */}
  <View style={styles.buttonRow}>
    <CustomButton
      testID="button-add-transaction"
      title="Add Transaction"
      onPress={handleAddExpense}
      textColor={Colors.button.primary.text}
      backgroundColor={Colors.button.primary.background}
      style={styles.addButton}
    />
  </View>
</View>
```

### 4. ExpenseItem.tsx

Add testIDs to transaction item elements:

```tsx
<View 
  testID={`transaction-item-${id}`}
  style={cardStyle}
>
  <TouchableOpacity 
    style={styles.transactionContent}
    onPress={handlePress}
  >
    <View style={styles.transactionInfo}>
      <Text style={[styles.description, descriptionColor]}>
        {description}
      </Text>
      <Text style={[styles.date, dateColor]}>
        {formattedDate}
      </Text>
    </View>
    
    <Text style={[styles.amount, amountColorStyle]}>
      {formattedAmount}
    </Text>
  </TouchableOpacity>

  {/* If you have edit button */}
  <TouchableOpacity
    testID={`button-edit-${id}`}
    onPress={handleEdit}
  >
    <Text>Edit</Text>
  </TouchableOpacity>

  {/* If you have delete button */}
  <TouchableOpacity
    testID={`button-delete-${id}`}
    onPress={() => onDelete(id)}
  >
    <Text>Delete</Text>
  </TouchableOpacity>
</View>
```

### 5. CustomButton.tsx

Add testID support to custom button:

```tsx
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  textColor: string;
  backgroundColor: string;
  style?: any;
  testID?: string; // Add this prop
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  textColor,
  backgroundColor,
  style,
  testID, // Destructure it
}) => {
  return (
    <TouchableOpacity
      testID={testID} // Pass it to TouchableOpacity
      style={[styles.button, {backgroundColor}, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, {color: textColor}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

## If You Have a Transaction Details Modal

If ExpenseItem opens a modal with edit/delete options, add these testIDs:

```tsx
<Modal
  testID="transaction-details-modal"
  visible={modalVisible}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalContent}>
    {/* Transaction details */}
    <Text>{description}</Text>
    <Text>{amount}</Text>

    {/* Edit button */}
    <TouchableOpacity
      testID="button-edit-transaction"
      onPress={handleEdit}
    >
      <Text>Edit</Text>
    </TouchableOpacity>

    {/* Delete button */}
    <TouchableOpacity
      testID="button-delete-transaction"
      onPress={handleDelete}
    >
      <Text>Delete</Text>
    </TouchableOpacity>

    {/* Cancel button */}
    <TouchableOpacity
      testID="button-cancel-edit"
      onPress={handleCancel}
    >
      <Text>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>
```

## Quick Checklist

After adding testIDs, verify you have:

- [ ] `testID="app-title"` on main title
- [ ] `testID="transaction-list"` on FlatList
- [ ] `testID="balance-card"` on balance card
- [ ] `testID="balance-amount"` on total balance
- [ ] `testID="income-amount"` on income total
- [ ] `testID="expense-amount"` on expense total
- [ ] `testID="expense-form"` on form container
- [ ] `testID="toggle-expense"` on expense toggle
- [ ] `testID="toggle-income"` on income toggle
- [ ] `testID="input-description"` on description input
- [ ] `testID="input-amount"` on amount input
- [ ] `testID="button-add-transaction"` on submit button
- [ ] `testID="transaction-item-{id}"` on each transaction
- [ ] Edit/delete buttons with appropriate testIDs

## Testing Your Changes

After adding testIDs, verify they work:

```bash
# Build app
npm run test:e2e:build

# Run a simple test
npm run test:e2e -- e2e/transactionCreation.e2e.ts
```

## Tips

1. **Use descriptive IDs**: `testID="button-add-transaction"` is better than `testID="btn1"`

2. **Be consistent**: Use kebab-case for all testIDs

3. **Include dynamic IDs for lists**: Use template literals for list items:
   ```tsx
   testID={`transaction-item-${id}`}
   ```

4. **Don't overdo it**: Only add testIDs to elements that tests need to interact with

5. **Document them**: Keep this guide updated when adding new interactive elements

## Troubleshooting

### "Element not found" errors

Check:
1. TestID is spelled correctly in both component and test
2. Element is actually rendered (not hidden by conditional)
3. Element is visible on screen (may need to scroll)

### Tests pass locally but fail in CI

Check:
1. AVD configuration matches
2. Timing issues (add more `waitFor()` calls)
3. Database operations complete before assertions

## Next Steps

After adding all testIDs:

1. Run the full test suite:
   ```bash
   npm run test:e2e
   ```

2. Fix any failing tests by adjusting testIDs or test logic

3. Commit changes:
   ```bash
   git add .
   git commit -m "Add testIDs for E2E testing"
   ```

4. Push and verify CI tests pass:
   ```bash
   git push origin your-branch
   ```
