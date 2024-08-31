import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";



export async function POST(res){
    const question = `
    Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

    You may assume that each input would have exactly one solution, and you may not use the same element twice.

    You can return the answer in any order.

    

    Example 1:

    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
    Example 2:

    Input: nums = [3,2,4], target = 6
    Output: [1,2]
    Example 3:

    Input: nums = [3,3], target = 6
    Output: [0,1]
    

    Constraints:

    2 <= nums.length <= 104
    -109 <= nums[i] <= 109
    -109 <= target <= 109
    Only one valid answer exists.
    `
    const answer = `
    function twoSum(nums, target) {
        const map = new Map();
        for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
                return [map.get(complement), i];
            }
            map.set(nums[i], i);
        }
    }
    `
    const spaceComplexity = 'O(n)'
    const timeComplexity = 'O(n)'
    const difficulty = 'Easy'
    // const tags = ['Array', 'Hash Table']
    const tags = { Array: true, 'Hash Table': true, 'Linked Lists': false,  'Two Pointers': false }

    const { error } = await supabase.from('Algorithms').insert([
        {
            question: question,
            answer: answer,
            spaceComplexity:spaceComplexity,
            difficulty: difficulty,
            tags: tags,
            timeComplexity:timeComplexity,
        },
    ]);

    if (error) {
        console.error('Error inserting algorithm:', error);
        return NextResponse.json({ message: 'Error inserting algorithm' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Algorithm inserted successfully' });


}