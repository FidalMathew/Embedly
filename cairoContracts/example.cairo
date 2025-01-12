use core::starknet::{ContractAddress};

// Define an interface `ICounter` for interacting with the contract
#[starknet::interface]
pub trait ICounter<TContractState> {
    fn set_count(ref self: TContractState, new_count: u64); // Sets the `count` value
    fn get_count(self: @TContractState) -> u64; // Gets the current `count` value
    fn increase_count(ref self: TContractState); // Increases the `count` by 1
    fn decrease_count(ref self: TContractState); // Decreases the `count` by 1
    fn get_user(self: @TContractState) -> ContractAddress; // Returns the caller's address

    // Functions to manage an array
    fn add_value_to_array(ref self: TContractState, value: u64); // Adds a value to the array
    fn get_array_length(self: @TContractState) -> u64; // Gets the array's length
    fn get_array(self: @TContractState) -> Array<u64>; // Returns the entire array
    // Modify a specific index of the array
    fn modify_nth_address(ref self: TContractState, index: u64, value: u64);
    fn get_array_element(
        self: @TContractState, index: u64,
    ) -> Option<u64>; // Gets an element by index

    // Functions for managing a mapping
    fn setMap(ref self: TContractState, value: u64); // Maps a `value` to the caller's address
    fn getMap(
        self: @TContractState, value: u64,
    ) -> ContractAddress; // Gets the mapped address for a `value`


    fn add_user_to_array(ref self: TContractState, value: ByteArray);
}

#[starknet::contract]
mod Counter {
    use super::ICounter;
    use core::starknet::{ContractAddress, get_caller_address};
    use core::starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait, Map,
        StoragePathEntry,
    };

    // Define the storage structure for the contract
    #[storage]
    pub struct Storage {
        count: u64, // Holds a single count value
        arr: Vec<u64>, // A vector to store u64 values
        address_mapping: Map<
            u64, ContractAddress,
        >, // A mapping of u64 keys to ContractAddress values
        user_arr: Vec<ByteArray>,
        boolean_arr: Vec<bool>,
    }

    // Constructor to initialize the contract's state
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.count.write(0); // Initialize the count to 0
    }

    // Events emitted by the contract
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CounterEmission: CounterEmission, // Emitted when `count` changes
        ArrayValueAddition: ArrayValueAddition // Emitted when a value is added to the array
    }

    // Event structure for `CounterEmission`
    #[derive(Drop, starknet::Event)]
    pub struct CounterEmission {
        pub counter: u64 // The new value of `count`
    }

    // Event structure for `ArrayValueAddition`
    #[derive(Drop, starknet::Event)]
    pub struct ArrayValueAddition {
        pub value: u64 // The value added to the array
    }

    // Implementation of the `ICounter` interface
    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        // Sets the `count` value and emits an event
        fn set_count(ref self: ContractState, new_count: u64) {
            self.count.write(new_count);
            self.emit(CounterEmission { counter: new_count });
        }

        // Returns the current value of `count`
        fn get_count(self: @ContractState) -> u64 {
            self.count.read()
        }

        // Increases the value of `count` by 1
        fn increase_count(ref self: ContractState) {
            assert!(self.count.read() > 0, "Count cannot be negative");
            self.count.write(self.count.read() + 1);
            self.emit(CounterEmission { counter: self.count.read() });
        }

        // Decreases the value of `count` by 1
        fn decrease_count(ref self: ContractState) {
            assert!(self.count.read() > 0, "Count cannot be negative");
            self.count.write(self.count.read() - 1);
            self.emit(CounterEmission { counter: self.count.read() });
        }

        // Returns the caller's contract address
        fn get_user(self: @ContractState) -> ContractAddress {
            let owner = get_caller_address();
            owner
        }

        // Adds a value to the `arr` vector and emits an event
        fn add_value_to_array(ref self: ContractState, value: u64) {
            self.arr.append().write(value);
            self.emit(ArrayValueAddition { value });
        }

        fn add_user_to_array(ref self: ContractState, value: ByteArray) {
            self.user_arr.append().write(value);
        }

        // Returns the length of the `arr` vector
        fn get_array_length(self: @ContractState) -> u64 {
            self.arr.len() // len() returns u64
        }

        // Gets an element from the array at the specified index
        fn get_array_element(self: @ContractState, index: u64) -> Option<u64> {
            if let Option::Some(storage_ptr) = self.arr.get(index) {
                return Option::Some(storage_ptr.read());
            }
            return Option::None;
        }

        // Modifies the value at a specific index in the array
        fn modify_nth_address(ref self: ContractState, index: u64, value: u64) {
            if let Option::Some(storage_ptr) = self.arr.get(index) {
                storage_ptr.write(value);
            } else {
                panic!("Index out of bounds");
            }
        }

        // Returns the entire array as a new array
        fn get_array(self: @ContractState) -> Array<u64> {
            let mut arr1 = array![];
            for i in 0..self.arr.len() {
                arr1.append(self.arr.at(i).read());
            };
            arr1
        }

        // Sets a mapping of `value` to the caller's contract address
        fn setMap(ref self: ContractState, value: u64) {
            let caller = get_caller_address();
            self.address_mapping.entry(value).write(caller);
        }

        // Gets the address mapped to a given `value`
        fn getMap(self: @ContractState, value: u64) -> ContractAddress {
            self.address_mapping.entry(value).read()
        }
    }
}
