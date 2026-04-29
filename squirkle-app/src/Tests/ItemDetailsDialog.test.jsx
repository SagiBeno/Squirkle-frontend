import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { Dialog, Theme } from "@radix-ui/themes";
import ItemDetailsDialog from "../components/Dialogs/ItemDetailsDialog";

const { equipWeaponMock, unequipMock } = vi.hoisted(() => ({
    equipWeaponMock: vi.fn(),
    unequipMock: vi.fn(),
}));

vi.mock("../GameHandler.js", () => ({
    EquipWeapon: equipWeaponMock,
    Unequip: unequipMock,
}));

expect.extend(matchers);

const testItem = {
    id: "TEST_ITEM",
    name: "Test Item",
    description: "Leiras leiras test leiras",
    type: "Weapon",
    knockback: 5,
    imageName: "testimg.png",
    imageUrl: "testimg.png",
    stats: {
        id: "stats",
        circleDamage: 67,
        squareDamage: 67,
        triangleDamage: 67,
        critChance: 10,
        critDamage: 2,
        metadata: ["ABILITY_SMASH"],
    },
};

function createMetadataResponse() {
    return {
        metadata: {
            title: "Smash",
            description: "Deals heavy damage",
            backgroundColor: "#000000",
            textColor: "#ffffff",
        },
    };
}

function renderDialog(itemData, extraProps = {}) {
    const setOpen = vi.fn();

    render(
        <Theme>
            <Dialog.Root open onOpenChange={setOpen}>
                <ItemDetailsDialog
                    itemData={itemData}
                    parentDialog="Inventory"
                    setOpen={setOpen}
                    {...extraProps}
                />
            </Dialog.Root>
        </Theme>
    );

    return { setOpen };
}

afterEach(() => {
    cleanup();
    vi.clearAllMocks();

    global.fetch = vi.fn(async () => ({
        json: async () => createMetadataResponse(),
    }));
});

global.fetch = vi.fn(async () => ({
    json: async () => createMetadataResponse(),
}));

describe("ItemDetailsDialog -> item details", () => {
    test("Damage and other stats show properly", () => {
        renderDialog(testItem);

        expect(screen.getAllByText("67")).toHaveLength(3);
        expect(screen.getByText("Crit Chance: 10%")).toBeInTheDocument();
        expect(screen.getByText("Crit Damage: 2x")).toBeInTheDocument();
        expect(screen.getByText("Knockback: 5")).toBeInTheDocument();
    })
    
    test("Item description and title show properly", () => {
        renderDialog(testItem);

        expect(screen.getByText("ITEM DETAILS - Test Item")).toBeInTheDocument();
        expect(screen.getByText(testItem.description)).toBeInTheDocument();
        expect(screen.getAllByText(/Test Item/)).toHaveLength(2);
    })

    test("Item image source matches the item's stats", () => {
        renderDialog(testItem);

        const itemImage = screen.getByRole("img");
        expect(itemImage).toHaveAttribute("src", testItem.imageUrl);
        expect(itemImage).toHaveAttribute("width", "128");
        expect(itemImage).toHaveAttribute("height", "128");
    })
})

describe("ItemDetailsDialog -> Metadata", () => {
    test("Metadata title and description", async () => {
        renderDialog(testItem);

        expect(await screen.findByText("Smash")).toBeInTheDocument();
        expect(screen.getByText("Deals heavy damage")).toBeInTheDocument();
    })

    test("Metadata background and text color", async () => {
        renderDialog(testItem);

        const metadataTitle = await screen.findByText("Smash");
        const metadataDescription = screen.getByText("Deals heavy damage");
        const metadataContainer = metadataTitle.parentElement;

        expect(metadataContainer).toHaveStyle({
            backgroundColor: "rgb(0, 0, 0)",
            color: "rgb(255, 255, 255)",
        });
        expect(metadataTitle).toHaveStyle({ color: "rgb(255, 255, 255)" });
        expect(metadataDescription).toHaveStyle({ color: "rgb(255, 255, 255)" });
    })
    
})


describe("ItemDetailsDialog -> parent = Inventory", () => {
    test("Show equip button when item is unequipped", async () => {
        const user = userEvent.setup();

        renderDialog(testItem);

        const equipButton = await screen.findByRole("button", { name: "Equip Item" });
        expect(equipButton).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Unequip Item" })).not.toBeInTheDocument();

        await user.click(equipButton);

        expect(equipWeaponMock).toHaveBeenCalledWith(testItem);
    });

    test("Show unequip button when item is equipped", async () => {
        const user = userEvent.setup();
        const equippedItem = { ...testItem, state: "equipped" };

        renderDialog(equippedItem);

        const unequipButton = await screen.findByRole("button", { name: "Unequip Item" });
        expect(unequipButton).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Equip Item" })).not.toBeInTheDocument();

        await user.click(unequipButton);

        expect(unequipMock).toHaveBeenCalledWith(equippedItem.type);
    });
});

describe("ItemDetailsDialog -> parent = BuyListing", () => {
    test("Seller and price shows correctly", () => {
        const selectedListing = {
            username: "seller123",
            price: 420,
        };

        renderDialog(testItem, {
            parentDialog: "BuyListing",
            selectedListing,
        });

        expect(screen.getByText("Seller: seller123")).toBeInTheDocument();
        expect(screen.getByText("Price: 420")).toBeInTheDocument();
    })

    test("Buy item button shows up and calls the buy function", async () => {
        const user = userEvent.setup();
        const handleBuySelectedListing = vi.fn();
        const selectedListing = {
            username: "seller123",
            price: 420,
        };

        renderDialog(testItem, {
            parentDialog: "BuyListing",
            selectedListing,
            selectedListingBuyable: true,
            handleBuySelectedListing,
        });

        const buyButton = screen.getByRole("button", { name: /buy item/i });
        expect(buyButton).toBeInTheDocument();
        expect(buyButton).toBeEnabled();

        await user.click(buyButton);

        expect(handleBuySelectedListing).toHaveBeenCalledTimes(1);
    })

    test("Inactive listing cannot be purchased", () => {
        const selectedListing = {
            username: "seller123",
            price: 420,
        };

        renderDialog(testItem, {
            parentDialog: "BuyListing",
            selectedListing,
            selectedListingBuyable: false,
        });

        expect(screen.queryByRole("button", { name: /buy item/i })).not.toBeInTheDocument();
        expect(screen.getByText("This listing is inactive and can only be inspected.")).toBeInTheDocument();
    })
})

describe("ItemDetailsDialog -> parent = CreateInspection", () => {
    test("Set price shows the correct value", () => {
        renderDialog(testItem, {
            parentDialog: "CreateInspection",
            createListingForm: {
                price: 999,
            },
        });

        expect(screen.getByText("Selected for listing")).toBeInTheDocument();
        expect(screen.getByText("Type: Weapon")).toBeInTheDocument();
        expect(screen.getByText("Set Price: 999")).toBeInTheDocument();
    })
})
