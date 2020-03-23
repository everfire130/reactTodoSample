// 声明分类枚举类型
export enum ClassifyEnum {
    ALL,
    FINISHED,
    UN_FINISHED,
}

// 声明事项数据类型
export type ItemEntity = {
    id: number;
    text: string;
    finished: boolean;
};

const globalState: {
    items: ItemEntity[]
} = {
    items: []
}

export default globalState

